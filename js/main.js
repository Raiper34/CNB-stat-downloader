/**
 * CNB Stat Downloader
 * @Author: Filip Gulan
 * @Mail: raipergm34@gmail.com
 * @Website: http://www.raiper34.net
 */

$(document).ready(function ()
{
    var $input = $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 17, // Creates a dropdown of 15 years to control year
        format: 'dd.mm.yyyy'
    });
    var picker = $input.pickadate('picker');
    picker.set('select', new Date());

    $('#downloadButton').click(function ()
    {
        $.ajax({
            type: "GET",
            url: "http://www.cnb.cz/cs/financni_trhy/skd/statistika_skd/denni.txt",
            data: {'date': picker.get('select', 'dd.mm.yyyy')},
            success: function (result)
            {
                var blob = new Blob([result], {type: "text/plain;charset=utf-8"}); //to write to txt file
                saveAs(blob, "cbs_stat_" + picker.get('select', 'yyyy-mm-dd') + ".txt");
            }
        });
    });
});