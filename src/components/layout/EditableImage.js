import Image from "next/image";
import toast from "react-hot-toast";
import Add from "@/components/icons/Add"

export default function EditableImage({link, setLink, customSize}) {

  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData;
      data.set('file', files[0]);

      const uploadPromise = new Promise (async (resolve, reject) => {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: data,
        });
        if (response.ok){
            const link = await response.json();
            setLink(link);
            resolve()
        }
        else{
            reject()
        }
    })
    
    await toast.promise(uploadPromise, {
        loading: 'Uploading...',
        success: 'Upload complete!',
        error: 'Error, please check image dimensions are equal'
    })
    }
  }



  return (
    <>
    <label className="cursor-pointer normal-font">
      {link && (
        <div>
          <div className={`relative mx-auto ${customSize ? customSize : 'lg:w-60 lg:h-60 md:w-56 md:h-56 w-80 h-80'}`}>
              <Image src={link} alt="menu item" layout="fill"/>
          </div>
          <div className="mt-2 text-center">Change image</div>
        </div>


    )}
      {!link && (
        <div className={`bg-gray-200 border border-black flex flex-col justify-center items-center gap-y-1.5 ${customSize ? customSize : 'lg:w-60 lg:h-60 md:w-56 md:h-56 w-80 h-80'}`}>
            {!customSize && (
              <Add />
            )}
            <div className="font-light">Add Image</div>
        </div>
      )}
        <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange}/>
      </label>
    </>
  );
}