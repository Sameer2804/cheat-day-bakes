"use client";
import UserTabs from "@/components/layout/UserTabs"
import { useEffect, useState, useRef } from "react";
import { useProfile } from "@/components/UseProfile"
import toast from 'react-hot-toast';
import Cross from "@/components/icons/Cross"
import DeleteDialog from "@/components/common/DeleteDialog"
import EditableImage from "@/components/layout/EditableImage"
import Image from "next/image";
import NoticeBox from "@/components/common/NoticeBox";

export default function CategoriesPage() {
    
    const {loading:profileLoading, data:profileData} = useProfile();
    const categoryNameInputRef = useRef(null); // Create a ref for the input element

    const [categoryName, setCategoryName] = useState('')
    const [images, setImages] = useState(['']);
    const [categoryImages, setCategoryImages] = useState();
    const [categories, setCategories] = useState([]);
    const [menuItemCategories, setMenuItemCategories] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteCategoryID, setDeleteCategoryID] = useState('');

    useEffect(() => {
      fetchCategories();
    }, [])

    useEffect(() => {
      fetchMenuItemCategory();
    }, [categories])

    useEffect(() => {
      if(!showDeleteDialog) {
        setDeleteCategoryID('')
      }
    }, [showDeleteDialog])

    function fetchCategories() {
      fetch('/api/categories').then(response => {
        response.json().then(categories => {
          const filteredCategories = categories.filter(categories => categories._id != '663763607c0a5deda8b70c57')
          setCategories(filteredCategories);
        })
      })
    }

    function fetchMenuItemCategory() {
      fetch('/api/menu-items').then(response => {
        response.json().then(menuItems => {
          const categoryOnly = menuItems.filter(item => item.categoryID ? true : false);
          const filteredCategories = categoryOnly.filter(categories => categories._id != '663763607c0a5deda8b70c57')
          setMenuItemCategories(filteredCategories);

          const categoryImages = filteredCategories.map(menuItem => findCategoryImage(menuItem) || '');
          setCategoryImages(categoryImages);
        })
      })
    }

    async function handleCategorySubmit(e) {
        e.preventDefault();
        const creationPromise = new Promise(async (resolve, reject) => {
          const data = {name: categoryName, images};
          if (editedCategory) {
            data._id = editedCategory._id;
          }
          const response = await fetch('/api/categories', {
            method: editedCategory ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (response.ok){
            resolve();
            setCategoryName('');
            fetchCategories();
            setEditedCategory(null);
            setImages(['']);
          }
          else{
            reject();
          }
        });
        await toast.promise(creationPromise, {
          loading: editedCategory ? 'Updating category...' : 'Creating your new category...',
          success: editedCategory ? 'Category updated' : 'Category created',
          error: 'An error has occured, please ensure category has image',
        });
      }

    async function handleCategoryDelete(_id) {
      const promise = new Promise(async (resolve, reject) => {
        const response = await fetch('/api/categories?_id='+_id, {
          method: 'DELETE'
        });
        if (response.ok) {
          resolve();
        }
        else{
          reject();
        }
      });

      await toast.promise(promise, {
        loading: 'Deleting...',
        success: 'Deleted',
        error: 'Error, cannot delete this category, check it does not belong to any items'
      })

      fetchCategories();
    }

    function findCategoryImage(menuItem) {
        const categoryFound = categories.find(item => item._id == menuItem.categoryID);
        if(categoryFound && menuItem.images) {
          return menuItem.images[0]
        }
    }

    if(profileLoading) {
        return 'Loading info...';
    }

    if(!profileData.admin) {
        return 'Not an admin';
    }


    return(
        <section className="max-w-6xl mx-auto lg:mt-14 mt-8 mb-28 px-6 lg:grid" style={{gridTemplateColumns: '20% 80%' }}>
            <UserTabs isAdmin={profileData.admin} />
            <div className="lg:mx-0">
              <div className="mb-10 max-w-2xl mx-auto lg:mx-0 lg:col-span-3">
                <NoticeBox>Note: Categories will only be displayed to customers if there are menu items within them</NoticeBox>
              </div>
              <form className="max-w-2xl mx-auto lg:mx-0 lg:col-span-3 lg:flex gap-x-5" onSubmit={handleCategorySubmit}>
              {images.map((image, index) => (
                      <div key={index} className="">
                          <EditableImage
                              link={image}
                              setLink={newImage =>
                                  setImages(prevImages => {
                                      const updatedImages = [...prevImages];
                                      updatedImages[index] = newImage;
                                      return updatedImages;
                                  })
                              }
                              customSize={'w-24 h-24 rounded-md text-sm'}
                          />
                      </div>
                  ))}
                  <div className="flex-grow">
                      <label htmlFor="category" ref={categoryNameInputRef}>
                        {editedCategory ? 'Update category' : 'New category name'}
                        {editedCategory && (
                          <div className="inline-flex items-center">
                          :<b className="ml-1.5 mr-1">{editedCategory.name}</b>
                            <div className="-mb-2">
                              <Cross onClick={() => {
                                setCategoryName('');
                                setEditedCategory(null);
                                setImages([''])
                              }} />
                            </div>
                          </div>
                        )}
                      </label>
                      <input type="text" id="category"
                      value={categoryName} onChange={e => setCategoryName(e.target.value)} required/>
                  </div>
                  <div className="mx-auto">
                      <button className="mt-[1.91rem] create-btn text-[0.9rem]" type="submit">
                          {editedCategory ? 'Update' : 'Create'}
                      </button>
                  </div>
              </form>
              <div className="max-w-2xl mx-auto lg:mx-0 lg:col-span-3">
                <div className="text-xs mt-10 lg:mt-5 pb-1 font-light tracking-widest border-b border-thinGray">EXISTING CATEGORIES</div>
                <div>
                  <DeleteDialog 
                    open={showDeleteDialog} 
                    setOpen={setShowDeleteDialog} 
                    onDelete={() => handleCategoryDelete(deleteCategoryID)} 
                    title={'Delete category'} 
                    text={'Are you sure you want to delete this category? This action cannot be undone.'}/>
                  {categories?.length > 0 && categories.map((category, index) => (
                    <div className="flex py-5 border-b border-thinGray items-center">
                        <div className="">
                        {categoryImages ? (
                            <Image 
                                key={index} 
                                src={categoryImages[index]} 
                                width={140} 
                                height={140}
                                className="rounded-md mr-3"
                            />
                            ) : (
                              <div className={'bg-gray-200 border border-black flex flex-col justify-center items-center gap-y-1.5 size-36 rounded-md mr-3'}>
                                  <div className="font-light">Loading...</div>
                              </div>
                            )}
                        </div>                      
                      <div className="font-ovo text-2xl mr-auto">{category.name}</div>
                      <button 
                      className="text-[0.9rem] bg-primary text-white px-8 py-2 rounded-lg hover:bg-dark" 
                      onClick={() => {
                        categoryNameInputRef.current.scrollIntoView({ behavior: "smooth" });
                        setEditedCategory(category);
                        setCategoryName(category.name);
                        setImages(prevImages => {
                          const updatedImages = [...prevImages];
                          updatedImages[0] = findCategoryImage(menuItemCategories.find(item => item.categoryID == category._id));
                          return updatedImages;
                      })
                        }}>
                        Edit
                      </button>
                      <button 
                      className="ml-5 text-[0.9rem] text-primary border border-primary px-6 py-2 rounded-lg hover:bg-secondary"
                      onClick={() => {setDeleteCategoryID(category._id); setShowDeleteDialog(true)}}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </section>
    )
}