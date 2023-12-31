import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getComments, getUserData, writeComment, deleteComment } from '../../services/profileServices/profileServices';
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';
import ReactStars from 'react-stars'
import { toast } from 'react-toastify';
import Menu from '../../components/Menu';
import useRedirectLoggedOut from '../../customHook/useRedirectLoggedOut';


const Profile = () => {
    useRedirectLoggedOut("/");
    const params = useParams();


    // Kommentek
    const [comments, setComments] = useState([]);
    const [userData, setUserData] = useState([]);
    const [myProfileID, setMyProfileID] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [ProfilePicture, setProfilePicture] = useState("");
    const [profileRating, setProfileRating] = useState(0);
    const [userAdmin, setUserAdmin] = useState(0);

    const commentRef = useRef();
    var rating = 0

    const ratingChanged = (newRating) => {
        console.log(newRating)
        rating = newRating;
    }

    useEffect(() => {
        const getProfileData = async (userID) => {
            // Kommentek
            getComments(userID).then(function (result) {
                console.log(result)
                setComments(result);

                let sum = 0;
                let index = 0
                result.forEach(element => {

                    sum += element.commentValue
                    index++;
                });

                if (sum === 0) {
                    setProfileRating("Még nincs értékelve");
                } else {
                    setProfileRating(sum / index)
                }

            });

            // User adatok
            getUserData(userID).then(function (result) {
                console.log(result)
                setUserData(result);
                if (result) {
                    setProfilePicture(result.image);
                }
            })

            const TokenValue = Cookies.get("token")
            const myUserID = jwt_decode(TokenValue).id

            setMyProfileID(myUserID)
        }

        getProfileData(params.userID)

        const TokenValue = Cookies.get("token")


        getUserData(jwt_decode(TokenValue).id).then(function (result) {
            setUserAdmin(result.admin);

        })

    }, [params.userID])


    function onClose() {
        setModalOpen(false);
    }

    return (
        <>
            <Menu pageNumber={9} />
            <div className="profile-container">
                <div className="profile">
                    <div className="left-section">
                        <div className="header">
                            <div className="name-group">
                                {userData ? userData.fullName : "Nem található név"}
                            </div>
                            {ProfilePicture && (
                                <center><img alt="" src={ProfilePicture}></img></center>
                            )}

                            <div className="rank">
                                {userData.admin > 0 ?
                                    "Admin"
                                    :
                                    "Felhasználó"
                                }
                            </div>
                            <div className="driving-value">
                                {profileRating === "Még nincs értékelve" ?
                                    <ReactStars
                                        count={5}
                                        size={24}
                                        color2={'#4BB0FE'}
                                        edit={false}
                                        value={0}
                                        isHalf={true}
                                    />
                                    :
                                    <ReactStars
                                        count={5}
                                        size={24}
                                        color2={'#4BB0FE'}
                                        edit={false}
                                        value={profileRating}
                                        isHalf={true}
                                    />
                                }

                                {profileRating}

                            </div>

                        </div>
                        <div className="details">
                            <ul>
                                <li>
                                    Regisztált: {
                                        userData?.registerTime?.substring(0, 10)
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="right-section">
                        <div className="header">
                            <div className="user-text">Felhasználói információk</div>
                            {params.userID === myProfileID ?
                                <Link to="/editProfile/" className="edit-profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" /></svg>
                                    <div className="text">Szerkesztés</div>
                                </Link>
                                :
                                <div className="edit-profile" onClick={(e) => {
                                    setModalOpen(true);
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>
                                    <p>Új komment</p>

                                </div>
                            }
                        </div>
                        <div className="content">
                            <div className="content-info">
                                <div className="info-row">
                                    <p>Vezetéknév</p>
                                    <p>{userData.firstName ? userData.firstName : "Nem sikerült betölteni"}</p>
                                </div>
                                <div className="info-row">
                                    <p>Keresztnév</p>
                                    <p>{userData.surName ? userData.surName : "Nem sikerült betölteni"}</p>
                                </div>
                                <div className="info-row">
                                    <p>E-Mail cím</p>
                                    <p>{userData.email ? userData.email : "Nem sikerült betölteni"}</p>
                                </div>
                                <div className="info-row">
                                    <p>Telefonszám</p>
                                    <p>{userData.phoneNumber ? userData.phoneNumber : "Nem sikerült betölteni"}</p>
                                </div>
                                <div className="info-row">
                                    <p>Jogosítvány megszerzésének időpontja</p>
                                    <p>{userData.licenseFrom ? userData.licenseFrom.substring(0, 10) : "Nem sikerült betölteni"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="comments">
                            <section className="comment-section">
                                <ul>
                                    {comments.map((commentSource, commentIndex) =>
                                        <li className="single-comment" key={commentIndex}>
                                            <img src={commentSource.commentImage} alt='' />
                                            <div className="comment-bg">
                                                <div className="comment-header">
                                                    <div className="comment-info">
                                                        <div className="comment-name">
                                                            {commentSource.ownerName}
                                                        </div>
                                                        <div className="comment-time">
                                                            {commentSource.commentDate.replace("T", " ")}
                                                        </div>
                                                    </div>
                                                    {parseInt(myProfileID) === parseInt(commentSource.ownerID) || userAdmin === 1 ?
                                                        <div className="comment-actions">
                                                            <svg onClick={(e) => {
                                                                console.log(commentSource.id)
                                                                deleteComment(commentSource.id).then(function (result) {
                                                                    if (result) {
                                                                        toast.success("Sikeresen kitörölted a kommentet");
                                                                        setTimeout(() => {
                                                                            window.location.reload();
                                                                        }, 2000)
                                                                    }
                                                                })
                                                            }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                                                        </div>
                                                        : <></>}
                                                </div>
                                                <div className="comment-content">
                                                    {commentSource.description}
                                                </div>
                                                <div className="comment-stars">
                                                    <ReactStars
                                                        count={5}
                                                        size={24}
                                                        color2={'#4BB0FE'}
                                                        edit={false}
                                                        value={commentSource.commentValue}
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>

                {modalOpen ?
                    <div className="overlay" onClick={onClose}>
                        <div className="modal-container" onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <div className="modal-content">
                                <div className="modal-picture">
                                    <img src={ProfilePicture} alt='' />
                                </div>
                                <div className="modal-right">

                                    <h1>Új komment</h1>
                                    <div className="stars">

                                        <ReactStars
                                            count={5}
                                            size={30}
                                            color2={'#4BB0FE'}
                                            edit={true}
                                            onChange={ratingChanged}
                                            half={false}
                                        />
                                    </div>
                                    <textarea placeholder="Komment..." cols="60" rows="5" ref={commentRef} ></textarea>
                                </div>
                            </div>
                            <div className="control-button-container">
                                <div className="control-button" onClick={(e) => {
                                    e.preventDefault();
                                    if (rating < 1) {
                                        toast.error("Nem adtál meg értékelést!")
                                        return
                                    }

                                    const commentData = {
                                        description: commentRef.current.value,
                                        commentValue: rating,
                                        ownerID: myProfileID,
                                        targetID: params.userID
                                    }

                                    writeComment(commentData).then(function (result) {
                                        if (result) {


                                            toast.success("Sikeresen írtál egy kommentet!");
                                            setTimeout(() => {

                                                window.location.reload();
                                            }, 1000)


                                        }
                                    })
                                }}>
                                    Komment írása
                                </div>
                                <div className="control-button" onClick={onClose}>
                                    Mégse
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }

            </div>
        </>
    )
}

export default Profile
