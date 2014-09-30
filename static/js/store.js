$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$( document ).ready(function() {
	function writeToFile(d1){
     
	}
    $('#configSubmit').on('submit',function () {
    var jsonObj = JSON.stringify($('#configSubmit').serializeObject());
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(jsonObj);
	writeToFile(encodeURIComponent(jsonObj))
	});
    jQuery.get('https://192.168.0.248/logs/adapCom.log', function(data) {
       $('#logDisplay').html(data.replace(/\n/g, "<br />"));
    });
});
