import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Button, Card, message, Modal } from "antd";
import { SaveOutlined, CheckOutlined, DownOutlined } from "@ant-design/icons";
import Navbar from "../components/Navbar.jsx";
import "../styles/home.css";
//import React from 'react';


import { useSelector } from "react-redux";

const { Meta } = Card;
import API_BASE_URL from "../constant.js";
import RecipeDetailsModal from "../components/RecipeDetailsModal.jsx";

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRecipeDetails, setSelectedRecipeDetails] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const userID = currentUser.data.data.user._id;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/recipe`);
                setRecipes(response.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/recipe/savedRecipes/ids/${userID}`
                );
                setSavedRecipes(response.data.data.savedRecipes);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRecipes();
        fetchSavedRecipes();
    }, [userID]);

    const saveRecipe = async (recipeID) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/v1/recipe/save`,
                {
                    recipeID,
                    userID,
                }
            );
            setSavedRecipes(response.data.data.savedRecipes);
            message.success("Recipe saved!");
        } catch (err) {
            console.error(err);
            message.error("Failed to save recipe");
        }
    };

    const isRecipeSaved = (id) => savedRecipes.includes(id);

    const truncateDescription = (description) => {
        const words = description.split(" ");
        if (words.length > 10) {
            return words.slice(0, 10).join(" ") + "...";
        }
        return description;
    };

    const getMoreDetailsOfRecipe = async (recipeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/recipe/${recipeId}`
            );
            setSelectedRecipeDetails(response.data.data);
            setDetailsModalVisible(true);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch recipe details");
        }
    };

    const closeModal = () => {
        setDetailsModalVisible(false);
        setSelectedRecipeDetails({});
    };

    return (
        <>
            <Navbar />
            <div className="homeContainer container">
                <p className="sectionHeading">Recipes</p>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 4,
                    }}
                    dataSource={recipes}
                    renderItem={(recipe) => (
                        <List.Item>
                            <Card
                                className="recipeCard"
                                title={recipe.name}
                                cover={<img alt={recipe.name} src={recipe.recipeImg} />}
                                actions={[
                                    <Button
                                        type="primary"
                                        icon={
                                            isRecipeSaved(recipe._id) ? (
                                                <CheckOutlined />
                                            ) : (
                                                <SaveOutlined />
                                            )
                                        }
                                        onClick={() => saveRecipe(recipe._id)}
                                        disabled={isRecipeSaved(recipe._id)}
                                    >
                                        {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                                    </Button>,
                                    <Button type="primary" icon={<DownOutlined />} onClick={() => getMoreDetailsOfRecipe(recipe._id)}>Read More</Button>,
                                ]}
                            >
                                <Meta
                                    description={truncateDescription(recipe.description)}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
                <RecipeDetailsModal
                    visible={detailsModalVisible}
                    onCancel={closeModal}
                    recipeDetails={selectedRecipeDetails}
                />
    <hr></hr>
    <br></br>
    <br></br>
                <center>
                    <p>Join us and kick start your Cooking Journey \_(^^)_/</p>
                <a href="https://www.facebook.com/"><img className="fb" src="https://img.icons8.com/ios11/200/FAB005/facebook-new.png"></img></a>
                <a href="https://www.instagram.com/accounts/login/?hl=en"><img className="insta" src="https://kobelco-usa.com/media/8daf8e71-7328-47b7-a838-cc321f162c8c/9nuaFg/Social%20Media%20Buttons/kobelco-instagram.png"></img></a>
                <a href="https://x.com/i/flow/login?input_flow_data=%7B%22requested_variant%22%3A%22eyJteCI6IjIifQ%3D%3D%22%7D"><img className="x" src="https://pngimg.com/d/twitter_PNG23.png"></img></a>
                </center>
            </div>
        </>
    );
}
