"use client";
import UserTabs from "@/components/layout/UserTabs"
import { useEffect, useState } from "react";
import { useProfile } from "@/components/UseProfile"
import toast from 'react-hot-toast';
import Cross from "@/components/icons/Cross"
import DeleteDialog from "@/components/common/DeleteDialog"

export default function CategoriesPage() {
    
    const {loading:profileLoading, data:profileData} = useProfile();

    const [categoryName, setCategoryName] = useState('')
    const [categories, setCategories] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteCategoryID, setDeleteCategoryID] = useState('');

    useEffect(() => {
      fetchCategories();
    }, [])

    useEffect(() => {
      if(!showDeleteDialog) {
        setDeleteCategoryID('')
      }
    }, [showDeleteDialog])

    function fetchCategories() {
      fetch('/api/categories').then(response => {
        response.json().then(categories => {
          setCategories(categories);
        })
      })
    }

    async function handleCategorySubmit(e) {
        e.preventDefault();
        const creationPromise = new Promise(async (resolve, reject) => {
          const data = {name: categoryName};
          if (editedCategory) {
            data._id = editedCategory._id;
          }
          const response = await fetch('/api/categories', {
            method: editedCategory ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          setCategoryName('');
          fetchCategories();
          setEditedCategory(null);
          if (response.ok)
            resolve();
          else
            reject();
        });
        await toast.promise(creationPromise, {
          loading: editedCategory ? 'Updating category...' : 'Creating your new category...',
          success: editedCategory ? 'Category updated' : 'Category created',
          error: 'An error has occured',
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

    if(profileLoading) {
        return 'Loading info...';
    }

    if(!profileData.admin) {
        return 'Not an admin';
    }


    return(
        <section className="max-w-6xl mx-auto mt-14 mb-28 px-6 lg:grid" style={{gridTemplateColumns: '20% 80%' }}>
            <UserTabs isAdmin={profileData.admin} />
            <div className="lg:mx-0 px-5">
              <form className="max-w-2xl mx-auto lg:mx-0 lg:col-span-3 lg:flex gap-x-5" onSubmit={handleCategorySubmit}>
                  <div className="flex-grow">
                      <label htmlFor="category">
                        {editedCategory ? 'Update category' : 'New category name'}
                        {editedCategory && (
                          <div className="inline-flex items-center">
                          :<b className="ml-1.5 mr-1">{editedCategory.name}</b>
                            <div className="-mb-2">
                              <Cross onClick={() => {
                                setCategoryName('');
                                setEditedCategory(null);
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
                  {categories?.length > 0 && categories.map(category => (
                    <div className="flex py-5 border-b border-thinGray items-center">
                    
                      <div className="font-ovo text-2xl mr-auto">{category.name}</div>
                      <button 
                      className="text-[0.9rem] bg-primary text-white px-8 py-2 rounded-lg hover:bg-dark" 
                      onClick={() => {
                        setEditedCategory(category);
                        setCategoryName(category.name);
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