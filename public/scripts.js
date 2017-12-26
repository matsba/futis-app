function cancelButton(event) {
    event.preventDefault()
    let target = event.target
    let buttonText = "Peruuta"
    let confirmText = "Varmasti?"

    if(target.innerText == confirmText){
      return history.back(-1)
    }

    target.classList.add("fade-out")
    setTimeout(() => {
        target.innerText = confirmText
        target.classList.remove("fade-out")
    }, 750)

    setTimeout(() => {
        target.classList.add("fade-out")
        setTimeout(() => {
            target.innerText = buttonText
            target.classList.remove("fade-out")
        }, 750)
    }, 5000)

    /*
    $(target).animate({"opacity": 0}, 1000, function(){
      $(this).text(confirmText)
    }).animate({"opacity": 1}, 1000)
    */
  }