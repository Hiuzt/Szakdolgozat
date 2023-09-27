import React from 'react'
import Menu from "../components/Menu";
import "../design.css";
import carImage from "../files/car1.png";
import carImage2 from "../files/car2.png";
import useRedirectLoggedOut from '../customHook/useRedirectLoggedOut';

const Home = () => {
	useRedirectLoggedOut("/")
  return (
    <div>
      	<Menu pageNumber={0}/>
      	<div className="home-container">
        	<div className="home-items">
				<img src={carImage} alt="" />
				<div className="text">
					<div className="big-text">
						Foglalj a Towely cég autó foglaló rendszerével
					</div>
					<div className="small-text">
					Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.					</div>
				</div>
			</div>
        	<div className="home-items">
				
				<div className="text">
					<div className="big-text">
					Foglalj a Towely cég autó foglaló rendszerével
					</div>
					<div className="small-text">
					Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.					</div>
				</div>
				<img src={carImage2} alt="" />
			</div>			
			
      	</div> 

    </div>
      
    
  	)
}

export default Home