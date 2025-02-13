<template>
  <basic-container class="newCss">
    <div class="menuTitle">待办设置</div>
    <!-- SRC
    <video id="video2" src="http://172.16.10.149:18887/aicos/api/aicos-file/miniofile/downloadByFileType/000000/movie_1665572681608.webm" controls preload="auto" autoplay="true"></video>
    <hr>
    <hr>
    <hr>
    AJAX
    <video id="video" :src="vsrc" controls preload="auto" autoplay="true"></video>
    <avue-form :option="option" v-model="form"></avue-form> -->
  </basic-container>
</template>
<script>

/*  export const mp4file = (data) => {
  return request({
    //url: `/aicos/api/aicos-file/miniofile/downloadByFileType/000000/2021102623132890015_1665566788320.mp4`,
    url: `/aicos/api/aicos-file/miniofile/downloadByFileType/000000/movie_1665572681608.webm`,
    
    ///miniofile/downloadByFileType/000000/movie_1665569526279.ogg
    //url: `/aicos/api/aicos-file/miniofile/downloadByFileType/000000/movie_1665569526279.ogg`,
    method: 'get',
    responseType:"arraybuffer",
    //responseType:"blob",
    data
  })
}

*/
// import { baseURL } from '@/api/common';
// import serviceList from "@/config/serviceList";

// import {
//   mp4file
// } from "@/api/system/commonFormSet";


// export default {
//   data() {
//     return {
//       //vsrc:'https://www.w3school.com.cn/i/movie.ogg',
//       vsrc: '',
//       form: {
//         video: '/i/movie.ogg',
//         imgUrl: [
//           { "label": "img", "value": "/images/logo-bg.jpg" },
//           { "label": "video", "value": 'https://www.w3school.com.cn/i/movie.ogg' },
//           { "label": 'audio', "value": 'https://www.runoob.com/try/demo_source/horse.mp3' }
//         ],
//       },
//       option: {
//         labelWidth: 120,
//         column: [{
//             label: '应用示例',
//             prop: 'pic',
//             hide: true,
//             type: 'upload',
//             listType: 'picture-card',
//             limit: 12,
//             //accept:"image/*",
//             fileSize: 2 * 1024,
//             span: 24,
//             data: {
//               fromSystemName: "base",
//             },
//             propsHttp: {
//               res: 'data',
//               url: 'newFileName',
//               name: 'oldFileName',
//             },
//             tip: '请上传.jpg/png__360px*240px__应用示例图片，且不超过2M',
//             action: `${baseURL}api/${serviceList.file}/miniofile/upload`,
//             rules: [{
//                 required: true,
//                 message: "请上传应用示例",
//                 trigger: "blur"
//               },
//               //...getRules(['charNumHanUnderline'])
//             ]
//           },


//         ]
//       }
//     }
//   },
//   methods: {
//     init() {

//       var video = document.querySelector('#video');
//       var mediaSource = new MediaSource();
//       video.src = URL.createObjectURL(mediaSource);
//       mediaSource.addEventListener('sourceopen', sourceOpen);

//       function sourceOpen(e) {
//         URL.revokeObjectURL(video.src);
//         // 设置 媒体的编码类型
//         var mime = 'video/webm; codecs="vorbis,vp8"';

//         var mediaSource = e.target;
//         var sourceBuffer = mediaSource.addSourceBuffer(mime);

//         var videoUrl = '/aicos/api/aicos-file/miniofile/downloadByFileType/000000/movie_1665572681608.webm';

//         fetch(videoUrl).then(function(response) {
//             console.log(response)
//             return response.arrayBuffer();
//           })
//           .then(function(arrayBuffer) {
//             sourceBuffer.addEventListener('updateend', function(e) {
//               if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
//                 mediaSource.endOfStream();
//                 // 在数据请求完成后，我们需要调用 endOfStream()。它会改变 MediaSource.readyState 为 ended 并且触发 sourceended 事件。
//                 video.play().then(function() {}).catch(function(err) {
//                   console.log(err)
//                 });
//               }
//             });
//             sourceBuffer.appendBuffer(arrayBuffer);
//           });
//       }

//       /*mp4file().then( (res)=>{
//           this.downFile(res.data)
//           this.vsrc = res.data;
//       })*/
//     }
//   },
//   mounted() {
//     console.log(1111)
//     this.init();
//   }
// }

</script>
