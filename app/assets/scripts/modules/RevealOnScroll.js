import throttle from "lodash/throttle"

class ReavelOnScroll {
    constructor() {
        this.itemsToReavel = document.querySelectorAll(".feature-item")
        this.hideInitially()
        this.scrollThrottle = throttle(this.calcCaller, 200).bind(this)
        this.events()
    }

    events() {
        window.addEventListener("scroll", this.scrollThrottle)
    }

    calcCaller() {
        this.itemsToReavel.forEach(element => {
            this.calculateIfScrolledTo(element)
        })
    }

    calculateIfScrolledTo(element) {
        console.log("element calc")
        let scrollPercent = (element.getBoundingClientRect().top / window.innerHeight) * 100
        if (scrollPercent < 75) {
            element.classList.add("reveal-item__is-visible");
        }
    } 

    hideInitially () {
        this.itemsToReavel.forEach(element => element.classList.add("reveal-item"))
    }
}

export default ReavelOnScroll;