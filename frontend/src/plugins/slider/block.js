/* eslint-disable import/no-anonymous-default-export */
export default (editor, opts = {}) => {
    const bm = editor.BlockManager;
    const style = `<style>
    *,
*:before,
*:after {
    margin: 0;
    padding: 0;
}

html {
    font-size: 10px;
}

.arrow {
    position: absolute;
    top: 20%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #ffffff;
    z-index: 10;
}

#arrow-left {
    left: 3rem;
}

#arrow-right {
    right: 3rem;
}

.arrow i {
    font-size: 6rem;
    transition: all 0.6s ease-in-out;
}

.slider {
    overflow: hidden;
    height: 100vh;
    width: 100vw;
}

.slide {
    position: absolute;
    width: 100%;
    height: 40%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top;
    opacity: 0;
    transition: all 0.5s ease-in-out;
}

.slide.active {
    opacity: 1;
}

.slide-title {
    font-size: 6rem;
    color: #fff;
    position: absolute;
    top: 50%;
    left: -50%;
    transform: translateY(-50%);
    opacity: 0;
}

.slide.active .slide-title {
    opacity: 1;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.6s ease-in-out;
}

.slide-1 {
    background-image: url("../img/kasrik-sirnak-1.jpg");
}

.slide-2 {
    background-image: url("../img/kasrik-sirnak-2.jpg");
}

.slide-3 {
    background-image: url("../img/kasrik-sirnak-3.jpg");
}

.slide-4 {
    background-image: url("../img/kasrik-sirnak-4.jpg");
}

.slide-5 {
    background-image: url("../img/kasrik-sirnak-5.jpg");
}

.slide-6 {
    background-image: url("../img/kasrik-sirnak-6.jpg");
}

.slide-7 {
    background-image: url("../img/kasrik-sirnak-7.jpg");
}

.slide-8 {
    background-image: url("../img/kasrik-sirnak-8.jpg");
}

.slide-9 {
    background-image: url("../img/kasrik-sirnak-9.jpg");
}

.slide-10 {
    background-image: url("../img/kasrik-sirnak-10.jpg");
}

@media screen and (max-width: 600px) {

    .slide-title,
    .arrow i {
        font-size: 4rem;
        color: black;
    }
}
    </style>
    `;
    bm.add(opts.name, {
        label: '',
        category: opts.category,
        content: `<div class="container">
        <div class="slider">
            <div class="slide slide-1 active">
                <h4 class="slide-title">Slide 1</h4>
            </div>
            <div class="slide slide-2">
                <h4 class="slide-title">Slide 2</h4>
            </div>
            <div class="slide slide-3">
                <h4 class="slide-title">Slide 3</h4>
            </div>
            <div class="slide slide-4">
                <h4 class="slide-title">Slide 4</h4>
            </div>
            <div class="slide slide-5">
                <h4 class="slide-title">Slide 5</h4>
            </div>
            <div class="slide slide-6">
                <h4 class="slide-title">Slide 6</h4>
            </div>
            <div class="slide slide-7">
                <h4 class="slide-title">Slide 7</h4>
            </div>
            <div class="slide slide-8">
                <h4 class="slide-title">Slide 8</h4>
            </div>
            <div class="slide slide-9">
                <h4 class="slide-title">Slide 9</h4>
            </div>
            <div class="slide slide-10">
                <h4 class="slide-title">Slide 10</h4>
            </div>
            <div class="buttons">
                <div class="arrow" id="arrow-left">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <div class="arrow" id="arrow-right">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        </div>
       
    </div>
     ${style}`,
    });
};
