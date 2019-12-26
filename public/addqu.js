document.addEventListener("click", function(e){
    if(e.target.classList.contains("addQuestion")){
        swal({
            title: "Weldone!",
            text: "Question is added!",
            icon: "success",
          });
    }
});
