import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../api/utilis';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const AddPlant = () => {

  const { user } = useAuth();
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  // handle form submit 
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true)

    const form = e.target;
    const name = form.name.value;
    const description = form.description.value;
    const category = form.category.value;
    const price = parseInt(form.price.value);
    const quantity = parseInt(form.quantity.value);

    const image = form.image.files[0];
    const imageURL = await imageUpload(image);

    // seller information
    const seller = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email
    };

    const plantData = {
      name,
      description,
      category,
      price,
      quantity,
      image: imageURL,
      seller
    }

    console.table({plantData})

    // save plant in db
    try{
    await axiosSecure.post('/plants', plantData);
    toast.success("Data Added Successfully")
    }catch(err){
      console.log(err)
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm 
      handleSubmit={handleSubmit} 
      uploadButtonText={uploadButtonText} 
      setUploadButtonText={setUploadButtonText} 
      loading={loading} />
    </div>
  )
}

export default AddPlant
