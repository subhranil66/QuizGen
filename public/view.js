document.addEventListener("click", function(e){
    if(e.target.classList.contains("editQuestion")){
        $.ajax({
            type: "GET",
            url: "/editQuestion/" + e.target.id,
            data: {
                id: e.target.id
            },
            success: function(res){
                window.open('http://127.0.0.1:8000/editQuestion/' + e.target.id , '_self')
            }
        });
    }
});



document.addEventListener("click", function(e){
    if(e.target.classList.contains("deleteQuestion")){
        $.ajax({
            type: "POST",
            url: "/deleteQuestion/" + e.target.id,
            data: {
                id : e.target.id
            },
            success: function(res){
                e.target.parentElement.remove();
                location.reload();
                console.log(res);
            }
        });
    }
});


document.addEventListener("click", function(e){
    if(e.target.classList.contains("deleteQuestion")){
        swal({
            title: "Weldone!",
            text: "Question has been deleted!",
            icon: "success",
          });
    }
});
