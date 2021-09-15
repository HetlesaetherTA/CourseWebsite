import throttle from "lodash/throttle"
import debounce from "lodash/debounce"

class ReavelOnScroll {
    constructor(elements, thresholdPercent) {
        this.itemsToReavel = elements
        this.scrollThrottle = throttle(this.calcCaller, 200).bind(this)
        this.hideInitially()
        this.browserHeight = window.innerHeight;
        this.thresholdPercent = thresholdPercent;
        this.events()
    }

    events() {
        window.addEventListener("scroll", this.scrollThrottle);
        window.addEventListener("resize", debounce(() => {
            this.browserHeight = window.innerHeight
        }, 333))
    }

    calcCaller() {
        this.itemsToReavel.forEach(element => {
            if (element.isRevealed == false) {
                this.calculateIfScrolledTo(element);
            }
        })
    }

    calculateIfScrolledTo(element) {
        if (window.scrollY + this.browserHeight > element.offsetTop) {
            let scrollPercent = (element.getBoundingClientRect().top / this.browserHeight) * 100
            if (scrollPercent < this.thresholdPercent) {
                element.classList.add("reveal-item__is-visible");
                element.isRevealed = true;
                if (element.isLastItem) {
                    window.removeEventListener("scroll", this.scrollThrottle)
                }
            }
        }
    } 

    hideInitially () {
        this.itemsToReavel.forEach(element => {
            element.classList.add("reveal-item");
            element.isRevealed = false;
        })
        this.itemsToReavel[this.itemsToReavel.length - 1].isLastItem = true;
    }
}

export default ReavelOnScroll;