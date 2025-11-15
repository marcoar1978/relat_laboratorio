

$(document).ready(function () {

    $(document).on('click', '.icon-download', (e) => {
        rel_id = e.currentTarget.id.split('__')[1]
        get_relatorio(rel_id)

    })
})

function get_relatorio(rel_id){
    window.location.href = `/get_relatorio/${rel_id}`
    
    // $.ajax({
    //     url: `/get_relatorio/${rel_id}`,
    //     method: 'get',
    //     success: (response) => {
    //         console.log(response)
    //     }
    // })
}