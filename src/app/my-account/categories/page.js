"use client";
import UserTabs from "@/components/layout/UserTabs"
import { useEffect, useState } from "react";
import { useProfile } from "@/components/UseProfile"
import toast from 'react-hot-toast';

export default function CategoriesPage() {
    
    const {loading:profileLoading, data:profileData} = useProfile();

    const [categoryName, setCategoryName] = useState('')
    const [categories, setCategories] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);

    useEffect(() => {
      fetchCategories();
    }, [])

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

    if(profileLoading) {
        return 'Loading info...';
    }

    if(!profileData.admin) {
        return 'Not an admin';
    }


    return(
        <section className="max-w-5xl mx-auto mt-14 mb-28 px-6 lg:grid lg:grid-cols-4">
            <UserTabs isAdmin={true} />
            <div className="lg:mx-0 lg:col-span-3 ">
              <form className="max-w-2xl mx-auto lg:mx-0 lg:col-span-3 lg:flex gap-x-5" onSubmit={handleCategorySubmit}>
                  <div className="flex-grow">
                      <label htmlFor="category">
                        {editedCategory ? 'Update category' : 'New category name'}
                        {editedCategory && (
                          <>: <b>{editedCategory.name}</b></>
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
                      <button className="ml-5 text-[0.9rem] text-primary border border-primary px-6 py-2 rounded-lg hover:bg-secondary">
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