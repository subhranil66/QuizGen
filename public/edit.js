document.addEventListener("click", function(e){
    if(e.target.classList.contains("updateQuestion")){
        swal({
            title: "Weldone!",
            text: "Question has been updated!",
            icon: "success",
          });
    }
});
