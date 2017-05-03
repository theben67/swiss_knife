/**
**  This function is for download XLSX from JSON format.
**  Requirement: Import XLSX from the node package 'xlsx',
**               And import saveAs from the node package 'saveAs'
**  @Benjamin HOEFFLER
**  github: @theben67
**/

//This is our JSON, each key of object, is one column of our XLSX
var jsonToExport = [{
	Col1:"value1",
        Col2:"value2",
        Col3:"value3"
      },
      {
        Col1:"value4",
        Col2:"value5",
        Col3:"value6"
      },
      {
        Col1:"value7",
        Col2:"value8",
        Col3:"value9"
      },
      {
        Col1:"value10",
        Col2:"value11",
        Col3:"value12"
      },
      {
        Col1:"value13",
        Col2:"value14",
        Col3:"value15"
      }];

function downloadXLSX(jsonToExport) {
        //Here we select the current date by year-month-day
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var newdate = year + "-" + month + "-" + day;
        var exportData = [[]];


        //We transform our JSON data
        for(let i = 0; i < jsonToExport.length;i++){
            var row = [];
            for(var key in jsonToExport[i]){
                row.push(jsonToExport[i][key]);
                var indexOfKey = exportData[0].indexOf(key);
                if(indexOfKey < 0){
                    exportData[0].push(key);
                }
            }
            exportData.push(row);
        }


        var userName = "mySuperName";  //Username
        var option = {
            fileName: newdate+"_"+userName, //Name of XLSX file, year-month-day_userName.xlsx
                data: exportData  //Our export data, treaty in last loop
        };

        function datenum(v, date1904?) {
            if(date1904) v+=1462;
            var epoch = Date.parse(v);
            return (epoch - Number(new Date(Date.UTC(1899, 11, 30)))) / (24 * 60 * 60 * 1000);
        };

        function getSheet(data) {
            var ws = {};
            var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
            for(var R = 0; R != data.length; ++R) {
                for(var C = 0; C != data[R].length; ++C) {
                    if(range.s.r > R) range.s.r = R;
                    if(range.s.c > C) range.s.c = C;
                    if(range.e.r < R) range.e.r = R;
                    if(range.e.c < C) range.e.c = C;
                    var cell = {v: data[R][C],t:null,z:null };
                    if(cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                    if(typeof cell.v === 'number') cell.t = 'n';
                    else if(typeof cell.v === 'boolean') cell.t = 'b';
                    else if(cell.v instanceof Date) {
                        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                        cell.v = datenum(cell.v);
                    }
                    else cell.t = 's';

                    ws[cell_ref] = cell;
                }
            }
            if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        };

        function Workbook():void {
            if(!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }

        var wb = new Workbook(), ws = getSheet(option.data);
        
        wb.SheetNames.push(option.fileName);
        wb.Sheets[option.fileName] = ws;
        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), option.fileName+'.xlsx');

};

downloadXLSX(jsonToExport);
