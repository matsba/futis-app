function cancelButton(event) {
    event.preventDefault()
    let target = event.target
    let confirmText = "Varmasti?"
    
    if(target.innerText == confirmText){
      return history.back(-1)
    }
    $(target).animate({"opacity": 0}, 1000, function(){
      $(this).text(confirmText)
    }).animate({"opacity": 1}, 1000)
  
  }