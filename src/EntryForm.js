import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const EntryForm = ({ lat, long }) => {

    const [image, setImage] = useState(null);

    // Handle The Form
    const { register, handleSubmit } = useForm();
    const onFormSubmit = async data => {
        try {
            // Uploading Image and Get Link instead
            const imgData = new FormData();
            imgData.append('file', image);
            imgData.append('upload_preset', "instaclone");
            imgData.append('cloud_name', 'dqyayf3rf');
            const response = await axios.post(`https://api.cloudinary.com/v1_1/dqyayf3rf/upload`, imgData);
            data = { ...data, latitude: lat, longitude: long, image: response.data.url };
            await axios.post("https://twitch-travelog-api.herokuapp.com/api/logs", data);
            window.location.reload();
        } catch (error) {
            if (error) {
                alert('Something Went Wrong ... Please Try Again');
            }
        };
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <label htmlFor="title">Title</label>
            <input name="title" id="title" required ref={register} placeholder="Required Input" />
            <label htmlFor="description">Description</label>
            <textarea name="description" ref={register}></textarea>
            <label htmlFor="comments">Comments</label>
            <textarea name="comments" ref={register}></textarea>
            <label htmlFor="image">Image</label>
            <input
                type="file"
                name="image"
                id="image"
                onChange={e => setImage(e.target.files[0])}
            />
            <label htmlFor="visitedAt">Visit Date</label>
            <input type="date" name="visitedAt" required ref={register} placeholder="Required Input" />
            <label htmlFor="rating">Rating</label>
            <input id="rating" name="rating" type="number" min="1" max="10" ref={register} />
            <button type="submit">Create New Entry</button>
        </form>
    );
};

export default EntryForm;
