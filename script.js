const container = document.querySelector('.container');
const imagesCount = 21;
const array = [];
const clouds = document.querySelector('.clouds');
const clouds1 = document.querySelector('.clouds1');
const loadText = document.querySelector('.loading-status');

const gyro = document.querySelector('.gyroscope-test');



let loadedCounter = 0;
let currentCloudsPosition = imagesCount / 2;
window.currentDisplayedImage = 0;
const changeImageThrottled = throttle(changeImage, 200);

for (let index = 1; index < imagesCount; index++) {
    const element = imagesCount[index];
    fetch(`img/new-scrollImages/${index}.jpg`)
        .then(el => el.blob())
        .then(el => {
            array[index] = URL.createObjectURL(el);
            loadedCounter += 1;
            loadText.innerHTML = 'Loading ' + (loadedCounter * 100  / (imagesCount - 1)).toFixed(0);
            if ((loadedCounter * 100  / (imagesCount - 1)).toFixed(0) == 100) {
                loadText.innerHTML = 'Start move';
                gsap.set(container, { attr: { src: array[2] } });
            };
        })
}

window.addEventListener('mousemove', (e) => {
    if (loadedCounter < imagesCount -1) return;
    const posInPercent = Math.floor(e.clientX * imagesCount / document.documentElement.clientWidth);
    window.requestAnimationFrame(() => { 
      const cords = getAmplitudeOfMoving();
      if (e.clientX < cords.start || e.clientX > cords.end) return;
      const positionInPercent = e.type === 'touchmove' ? (e.targetTouches[0].clientX  * imagesCount / document.documentElement.clientWidth).toFixed()
      : ((e.clientX - cords.start)   * imagesCount / (document.documentElement.clientWidth * cords.scale) ).toFixed();
      const positionInPercentY = Math.floor(e.clientY * imagesCount / document.documentElement.clientWidth);
      changeImage(positionInPercent) 
    
    
    });
});
window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (loadedCounter < imagesCount -1) return;
    const posInPercent = Math.floor(e.targetTouches[0].clientX * imagesCount / document.documentElement.clientWidth);
    window.requestAnimationFrame(() => { changeImage(posInPercent) });
});
gsap.set(container.parentElement, {perspective:100, transformStyle:"preserve-3d"})
gsap.set(container, {scale: 1.2, transformStyle:"preserve-3d"})
function changeImage(posInPercent) {
    // console.log(array[posInPercent]);
    
    // console.log(cords);
    
   if (window.currentDisplayedImage !== posInPercent && array[posInPercent] !== undefined) {

    gsap.timeline()
    .set(container, { attr: { src: array[posInPercent] } })
    .to(container, { rotateY: posInPercent/-50, duration: 0.5 });
        if (window.currentDisplayedImage < posInPercent) {
            currentCloudsPosition = currentCloudsPosition - 1.5;
        }else {
            currentCloudsPosition = currentCloudsPosition + 1.5;
        }
        window.currentDisplayedImage = posInPercent;
    }
}

function throttle(func, ms) {

    let isThrottled = false,
      savedArgs,
      savedThis;
  
    function wrapper() {
  
      if (isThrottled) { // (2)
        savedArgs = arguments;
        savedThis = this;
        return;
      }
  
      func.apply(this, arguments); // (1)
  
      isThrottled = true;
  
      setTimeout(function() {
        isThrottled = false; // (3)
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }
  
    return wrapper;
  }

  function getAmplitudeOfMoving() {
    const width = document.documentElement.clientWidth;
    const percentOfScreenForMoving = 50;
    const start = (100 - percentOfScreenForMoving) / 2;
    const end = start + percentOfScreenForMoving;
    const cords = {
        start: width * start / 100,
        end: width * end / 100,
        // distance: 
        width: (width * end / 100) - (width * start / 100),
        scale: ((width * end / 100) - (width * start / 100)) / width
    }
    // console.table(cords);
    return cords;
}

