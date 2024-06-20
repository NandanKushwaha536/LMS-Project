import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";


function CreateCourse() {

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const [userInput, setUserInput]=useState({
       
        title: "",
        category:"",
        createdBy:"",
        descripation:"",
        thumbnail: null,
        previewImage:""
});

function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage=e.target.files[0];
    if(uploadedImage){
        const fileReader = new FileReader();
        fileReader.readAsDataURL(uploadedImage);
        fileReader.addEventListener('load', function (){
            setUserInput({
                ...userInput,
                previewImage:this.result,
                thumbnail:uploadedImage
            })
        })
    }
}
function handalUserInput(e){
    const [name, value]=e.target;
    setUserInput({
        ...userInput,
        [name]:value
    })
}

async function onFormSubmit(e){
    e.preventDefault();
    if(!userInput.title || !userInput.descripation || !userInput.category || !userInput.thumbnail ||!userInput.createdBy){
        toast.error('All fields are maindatory');
        return
    }

    const response = await dispatch(createNewCourse(userInput))
    if(response?.payload?.success){
        setUserInput({
            title: "",
            category:"",
            createdBy:"",
            descripation:"",
            thumbnail: null,
            previewImage:""
    });
    navigate('/courses')
    }
    
}
  return (
    <HomeLayout>
       <div className="flex items-center justify-center h-[100vh]">
       <form 
        onSubmit={onFormSubmit}
        className="flex flex-col gap-5 rounded-lg p-4 text-white w-[700px] 
        my-10 shadow-[0_0_10px_black] relative">
            <Link className="absolute top-8 text-2xl link text-accent cursor-pointer">
              <AiOutlineArrowLeft/>
            </Link>
            <h1 className="text-center text-2xl font bold">
                Create New Course
            </h1>

            <main className="grid grid-cols-2 gap-x-10">
                <div className="gap-y-6">
                    <div>
                        <label htmlFor="image_uploads" className="curser-pointer">
                            {userInput.previewImage ?(
                                <img 
                                src={userInput.previewImage} 
                                alt=""  
                                className="w-full h-44 m-auto border"/>
                            ):(
                                <div className="w-full h-4 m-auto flex items-center justify-center border">
                                   <h1 className="font-bold text-lg"> upload your curser thumbnail</h1>
                                </div>
                            )
                            }
                        </label>
                        <input 
                        className="hidden"
                        type="file" 
                        id="image_uploads"
                        accept=".jpg, .jpeg, .png"
                        name="image_upload"
                        onChange={handleImageUpload}
                         />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-lg font-semibold" htmlFor="title">
                            Course titile
                        </label>
                        <input
                         className="bg-transparent px-2 py-1 border" 
                         required
                         type="text"
                         name="title"
                         id="titile"
                         value={userInput.title}
                         placeholder="Enter Course title" 
                         onChange={handalUserInput}
                         />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                 <div className="flex flex-col gap-1">
                   <label className="text-lg font-semibold" htmlFor="createdBy">
                            Course instructor
                        </label>
                        <input
                         className="bg-transparent px-2 py-1 border" 
                         required
                         type="text"
                         name="createdBy"
                         id="createdBy"
                         value={userInput.createdBy}
                         placeholder="Enter Course instructor" 
                         onChange={handalUserInput}
                         />
                 </div>
                 <div className="flex flex-col gap-1">
                   <label className="text-lg font-semibold" htmlFor="category">
                            Course category
                        </label>
                        <input
                         className="bg-transparent px-2 py-1 border" 
                         required
                         type="text"
                         name="category"
                         id="category"
                         value={userInput.category}
                         placeholder="Enter Course instructor" 
                         onChange={handalUserInput}
                         />
                 </div>
                 <div className="flex flex-col gap-1">
                   <label className="text-lg font-semibold" htmlFor="description">
                            Course description
                        </label>
                        <textarea
                         className="bg-transparent px-2 py-1 h-24 overflow-scroll resize-none" 
                         required
                         type="text"
                         name="description"
                         id="description"
                         value={userInput.descripation}
                         placeholder="Enter Course instructor" 
                         onChange={handalUserInput}
                         />
                 </div>
                </div>
            </main>

            <button type="submit" className="w-full py-2 rounded-sm font-semibold text-lg bg-yellow-600 hover:bg-yellow-500 
            transition-all ease-in-out duration-300">Create course</button>
        </form>
       </div>
    </HomeLayout>
  )
}

export default CreateCourse