import axios from "axios"

class ClientArea {
    constructor() {
        this.injectHTML()
        this.clientArea = document.querySelector(".client-area")
        this.form = document.querySelector(".client-area__form")
        this.field = document.querySelector(".client-area__input")
        this.contentArea = document.querySelector(".client-area__content-area")
        this.events()
    }

    events() {
        document.addEventListener("keyup", e => this.keyPressHandler(e))
        this.form.addEventListener("submit", e => {
            e.preventDefault()
            this.sendRequest()
        })
    }

    sendRequest() {
        axios.post("https://serene-lamarr-3c2b21.netlify.app/.netlify/functions/ppa", b).then(response => {
            this.form.remove()
            this.contentArea.innerHTML = response.data
        }).catch(() => {
            this.contentArea.innerHTML = `<p class=""client-area__error>Incorrect Password</p>`
            this.field.value = ""
            this.field.focus()
        })
    }

    openClientArea() {
        this.clientArea.classList.add("client-area--is-visible")
    }

    keyPressHandler(e) {
        if (e.keyCode == 221) {
            this.openClientArea()
        }
    }

    injectHTML() {
        document.body.insertAdjacentHTML("beforeend", `
        <html><head></head><body><div class="client-area">
  <div class="wrapper wrapper--medium">
    <h2 class="section-title section-title--blue">Hidden Client Area</h2>
    <form class="client-area__form" action="">
      <input class="client-area__input" type="text" placeholder="Password">
      <button class="btn btn__orange">Submit</button>
    </form>
    <div class="client-area__content-area"></div>
  </div>
</div></body></html>
        `)
    }
}

export default ClientArea