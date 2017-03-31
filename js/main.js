/**
 * CNB Stat Downloader
 * @Author: Filip Gulan
 * @Mail: raipergm34@gmail.com
 * @Website: http://www.raiper34.net
 */

var date; //date
var pickerFrom;
var pickerTo;

$(document).ready(function ()
{
    //Initialize Datepickers
    var $inputFrom = $('#datepickerFrom').pickadate({
        selectMonths: true,
        selectYears: 34,
        format: 'dd.mm.yyyy'
    });
    var $inputTo = $('#datepickerTo').pickadate({
        selectMonths: true,
        selectYears: 34,
        format: 'dd.mm.yyyy'
    });
    pickerFrom = $inputFrom.pickadate('picker');
    pickerFrom.set('select', new Date());
    pickerTo = $inputTo.pickadate('picker');
    pickerTo.set('select', new Date());

    //Hide progress
    $('#progress').hide();

    /**
     * Handle button download click
     */
    $('#downloadButton').click(function ()
    {
        output = "";
        $('#progress').show();
        $('#downloadButton').addClass('disabled');
        $('#datepickerFrom').attr('disabled', 'disabled');
        $('#datepickerTo').attr('disabled', 'disabled');
        date = new Date(pickerFrom.get('select', 'yyyy/mm/dd'));
        var dateString = ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth() + 1)).slice(-2) + "." + date.getFullYear();
        ajaxCall(dateString);
    });

});

/**
 * Make ajjax call and call resursively until date to is processed
 * @param string date which want to download data
 */
function ajaxCall(dateString)
{
    $('#progressText').text("Working on date: " + dateString);
    $.ajax({
        type: "GET",
        url: "http://www.cnb.cz/cs/financni_trhy/skd/statistika_skd/denni.txt",
        data: {'date': dateString},
        success: function (result)
        {
            output += result + "\n";
            if (date < new Date(pickerTo.get('select', 'yyyy/mm/dd'))) //it is not date to, we call this function again and increment day
            {
                date.setDate(date.getDate() + 1);
                var dateString = ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth() + 1)).slice(-2) + "." + date.getFullYear();
                ajaxCall(dateString);
            } 
            else //all dates , from date to date was processed now, we can download file
            {
                $('#progress').hide();
                $('#downloadButton').removeClass('disabled');
                $('#datepickerFrom').removeAttr('disabled');
                $('#datepickerTo').removeAttr('disabled');
                var blob = new Blob([output], {type: "text/plain;charset=utf-8"}); //to write to txt file
                saveAs(blob, "cbs_stat_from" + pickerFrom.get('select', 'yyyy-mm-dd') + "to" + pickerTo.get('select', 'yyyy-mm-dd') + ".txt");
            }
        }
    });
}