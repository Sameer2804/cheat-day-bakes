import Image from "next/image";
import toast from "react-hot-toast";
import Plus from "@/components/icons/Plus"

export default function EditableImage({link, setLink}) {

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
        <div className="flex flex-col items-center">
            <Image src={link} alt="menu item" width={250} height={250}/>
            <span className="mt-1">Change image</span>
        </div>

    )}
      {!link && (
        <div className="bg-gray-200 h-[220px] border border-black flex flex-col justify-center items-center gap-y-1.5">
            <Plus />
            <div className="font-light">Add Image</div>
        </div>
      )}
        <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange}/>
      </label>
    </>
  );
}