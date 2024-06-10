import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import GalleryCard from "../common/GalleryCard"
import "./styles.css"



const CenteredDiv = styled.div`
display: flex;
height:50vw;
`;
const Gallery = styled.section`
  background-color: white;
  color: black;
  width: 98%;
  position: relative;
  padding: 1%;
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  margin: auto;

  /* Medium screens */
@media all and (max-width: 800px) {
  .navigation {
    /* When on medium ssized screens, we center it by evenly distributing empty space around items */
    justify-content: space-around;
  }

  transition: 0.5s;

}

  

/* Small screens */
@media all and (max-width: 500px) {
    /* On small screens, we are no longer using row direction but column */
    flex-direction: column;
  
}
`;

const Filter = styled.div`
  position: relative;
  width: 100%;
  margin: auto;
  transition: 0.5s;
`;

const Work = () => {
  var defaultWork = [
    { title:"Meeting Hill", imageUrl:"meetingHill.jpg", link:"/meetingHill/", linkText:"Line loot pinnace ahoy scurvy Jolly Roger squiffy clap", category:"art"},
    { title:"Singularity", imageUrl:"Singularity-Edit.gif", link:"/Singularity/", linkText:"Line loot pinnace ahoy", category:"art"},
    { title:"Skate", imageUrl:"meetingHill.jpg",link:"/Skate/",linkText:"Line loot pinnace ahoy scurvy Jolly",category:"virtual-production"}
    
  ]

  const [workList, setWorkList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState();

  useEffect(() => {
    setWorkList(defaultWork);
  }, []);

  // Function to get filtered list
  function getFilteredList() {
    // Avoid filter when selectedCategory is null
    if (!selectedCategory) {
      return workList;
    }
    return workList.filter((item) => item.category === selectedCategory);
  }

  // Avoid duplicate function calls with useMemo
  var filteredList = useMemo(getFilteredList, [selectedCategory, workList]);
  
  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }

  return (
    <div id="work-header" className="page" data-aos="fade-down">
        <div className="page-full" >
          {/* <h2>Work</h2> */}
          <CenteredDiv>
            <iframe src="https://www.youtube.com/embed/6ltKJ6FvQZY?modestbranding=1&autohide=1&showinfo=0&controls=1&rel=0&autoplay=0" width="100%" height="auto" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture;" allowFullScreen ></iframe>
          </CenteredDiv>
         
      <Gallery>

        <Filter>
        <div class="tabs">
          <label class="tab-header">
          <div class="tab-box">WE CREATE FOR</div>
          </label>
          <label class="tab">
            <input type="radio" name="category-list" id="category-list" value="virtual-production" class="tab-input" onChange={handleCategoryChange}></input>
            <div class="tab-box">VIRTUAL PRODUCTION</div>
          </label>
          <label class="tab">
            <input type="radio" name="category-list" id="category-list" value="music" class="tab-input" onChange={handleCategoryChange}></input>
            <div class="tab-box">MUSIC</div>
            </label>
            <label class="tab">
            <input type="radio" name="category-list" id="category-list" value="art" class="tab-input" onChange={handleCategoryChange}></input>
            <div class="tab-box">ART</div>
            </label>
            <label class="tab">
            <input type="radio" name="category-list" id="category-list" value="" class="tab-input" onChange={handleCategoryChange}></input>
            <div class="tab-box">... IN REAL-TIME</div>
            </label>
          </div>
        </Filter>
        {/* <div className="frame" data-aos="fade-up"></div> */}

          {filteredList.map((element, index) => (
          <GalleryCard {...element} key={index} />
        ))}

      </Gallery>
      </div>
    </div>
  );
};

export default Work;