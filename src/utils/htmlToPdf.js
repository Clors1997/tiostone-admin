import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import $ from 'jquery'

export default{
  install (Vue, options) {
    Vue.prototype.getPdf = function (title) {
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      }
      )
    },
    Vue.prototype.getPdf2 = function (title) {
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        let formdata = new FormData()
        var datauri = PDF.output('blob');
        function dataURLtoBlob(dataurl) {
                var arr = dataurl.split(',');
                var mime = arr[0].match(/:(.*?);/)[1];
                var bstr =atob(arr[1]);   
                var n = bstr.length;    
                var u8arr =new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type: mime });
            }

            function blobToFile(blob, fileName){
                blob.lastModifiedDate =new Date();
                blob.name = fileName;
                return blob;
            }

            function dataURLtoFile(dataurl, filename){
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                var blob = dataURLtoBlob(dataurl);
                return blobToFile(blob, filename);
            }
            var file = new File([ datauri ], "ex.pdf", {type: datauri.type, lastModifiedDate: Date.now()});
            // datauri.lastModifiedDate =;
            // datauri.name = "ex";
            console.log(file)
            formdata.append('pdf_file', file);
        $.ajax({
            url: 'http://keylab.cc/api/tio-data?page=pdf&action=upload',
            data: formdata,
            dataType: 'text',
            contentType: false,
            processData: false,
            mimeType: "multipart/form-data",
            async: false,
            type: 'POST',
         }).done(function (data) {
         }).fail(function (xhr, status, err) {
         });
      }
      )
    }
  }
}
