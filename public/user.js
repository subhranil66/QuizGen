function submitAnswer(uid, qid, event) {
    event.preventDefault();

    $(document).ready(function(){
        $.ajax({
            method: 'POST',
            url: '/score/' + uid,
            data:{
                
            },
            success: function(res){
                if(res.success == true){
                    alert('submitted');
                }
            }
        })
    })
}


function submitAnswer(uid, qid, event) {
    event.preventDefault();
/*
    $(document).ready(function(){
        $.ajax({
            method: 'POST',
            url: '/score/' + uid,
            data:{
                
            },
            success: function(res){
                if(res.success == true){
                    alert('submitted');
                }
            }
        })
    })
    */
}
// document.addEventListener("click", function(e){
//     if(e.target.classList.contains("submitQuestion")){
//         for(var i=0;i < data.length;i++){
//             for(var j=0;j < 4;j++){
//                 if(document.getElementById("I"+j).checked==true){
//                     console.log(data[i].value);
//                 }
//             }
//         }
//     }
// });