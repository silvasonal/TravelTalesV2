import { useEffect, useState } from 'react';
import axios from 'axios';
import TextInput from './SharedComponents/TextInput';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createPost, getPostByPostId, updatePost,getCountryData } from './services/apiService';
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [country, setCountry] = useState('');
    const [dateOfVisit, setDateOfVisit] = useState('');
    const [errors, setErrors] = useState({});
    const [countryCodes, setCountryCodes] = useState([]);
    const [countryData, setCountryData] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { postId } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCountryData = async () => {
            if (!country) return;

            try {
                const response = await getCountryData(country);
                setCountryData(response);
            } catch (error) {
                console.error('Error fetching country data:', error);
            }
        };
        fetchCountryData();
    }, [country]);



    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                const codes = response.data.map(country => ({
                    value: country.cca2,
                    label: country.name.common,
                }));
                setCountryCodes(codes);
            })
            .catch(error => {
                console.error('Error fetching country codes:', error);
            });
    }, []);

    useEffect(() => {
        if (postId) {
            fetchUpdatedPostData();
        } else {
            // Clear form fields when there's no postId (create mode)
            setTitle('');
            setContent('');
            setCountry('');
            setDateOfVisit('');
            setCountryData(null);
            setErrors({});
        }
    }, [postId]);


    const fetchUpdatedPostData = async () => {
        if (postId) {
            const response = await getPostByPostId(postId, token);
            const post = response.post;
            setTitle(post.title);
            setContent(post.content);
            setCountry(post.country);
            setDateOfVisit(post.date_of_visit);
        }
    };


    const createBlogPost = async () => {
        const newErrors = {
            title: !title ? 'Title is required' : '',
            content: !content ? 'Content is required' : '',
            country: !country ? 'Country is required' : '',
            dateOfVisit: !dateOfVisit ? 'Date of visit is required' : '',
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== ''); //This checks if at least one of those values is not an empty string 
        if (hasErrors) return;

        try {
            if (postId) {
                await updatePost(postId, title, content, country, dateOfVisit, token);
                setSnackbar({ open: true, message: 'Post updated successfully', severity: 'success' });

            } else {
                await createPost(title, content, country, dateOfVisit, token);
                setSnackbar({ open: true, message: 'Post created successfully', severity: 'success' });

                setTitle('');
                setContent('');
                setCountry('');
                setDateOfVisit('');
                setCountryData(null);
                setErrors({});
            }
        } catch (error) {
            console.error('Error while submitting post:', error);
            setSnackbar({ open: true, message: 'Failed to submit post', severity: 'error' });
        }
    };

    return (
        <div className="form container mt-4">
            <h4 className="text-left mb-4">{postId ? 'Update Blog' : 'Create Blog'}</h4>
            <div className="row g-3">
                <div className="col-md-4">
                    <TextInput
                        id="title"
                        label="Title"
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        errorMessage={errors.title}
                        required={true}
                    />
                </div>

                <div className="col-md-4">
                    <TextInput
                        id="content"
                        label="Content"
                        type="text"
                        placeholder="Enter content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        errorMessage={errors.content}
                        required={true}
                    />
                </div>

                <div className="col-md-4">
                    <label htmlFor="country" className="form-label">
                        Country <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                        id="country"
                        label="Country"
                        placeholder="Select a country"
                        options={countryCodes.map(country => ({
                            value: country.value,
                            label: country.label,
                        }))}
                        onChange={(selectedOption) => {
                            setCountry(selectedOption.value);
                        }}
                        value={country ? countryCodes.find(option => option.value === country) : null}
                    />
                    {errors.country && (
                        <div className="error-message">
                            {errors.country}
                        </div>
                    )}
                </div>

                <div className="col-md-4">
                    <TextInput
                        id="dateOfVisit"
                        label="Date of Visit"
                        type="date"
                        placeholder="Enter date of visit"
                        value={dateOfVisit}
                        onChange={(e) => setDateOfVisit(e.target.value)}
                        errorMessage={errors.dateOfVisit}
                        required={true}
                    />
                </div>
            </div>

            <div className="text-end mt-4">
                <button id="create_btn" onClick={createBlogPost} className="btn btn-success" >
                    {postId ? 'Update' : 'Create'}
                </button>
            </div>


           {countryData && (
                <div className="country-info-container">
                    <h5 className="country-info-title">Country Information</h5>

                    <div className="mb-2">
                        <strong>Capital:</strong> <span className="country-info-text">{countryData.capital}</span>
                    </div>

                    {countryData.currency.length > 0 && (
                        <div className="country-currency-info">
                            <span className="country-currency-label">Currencies:</span>
                            {countryData.currency.map((curr, index) => (
                                <span key={index} className="country-currency-item">
                                    {curr.code} - {curr.name} ({curr.symbol})
                                </span>
                            ))}
                        </div>
                    )}

                    {countryData.flag && (
                        <div>
                            <img
                                src={countryData.flag}
                                alt="Country Flag"
                                className="country-info-flag"
                            />
                        </div>
                    )}

                </div>
            )}
            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        </div>
    );
};

export default CreateBlog;