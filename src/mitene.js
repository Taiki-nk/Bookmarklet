import axios from 'axios';

const mitene = () => {
  const topUrl = location.href;

  const promises = [];
  const mediaCodes = [];

  for (let i = 1; i <= 100; i++) {
    //1755
    promises.push(
      axios({
        method: 'GET',
        url: topUrl + `?page=${i}`,
        responseType: 'document',
      })
    );
  }

  Promise.all(promises).then((res) => {
    // console.log(res);
    res.forEach((obj) => {
      obj.data.querySelectorAll('.media-thumbnail-container').forEach((el) => {
        mediaCodes.push(el.dataset.mediaFileUuid);
      });
		});

		// これをPHPにPOSTするように作る
		const postData = {
			'code': JSON.stringify(mediaCodes),
		}

		axios.post('http://localhost/bookmarklet/php/db.php',postData)
		


    
  });
	

  // .then((res) => {
  // 	const nodeList = res.data.querySelectorAll('.media-thumbnail-container')
  // 	// if (!nodeList.length) {
  // 	// 	return;
  // 	// }
  // 	nodeList.forEach(el => {
  // 		mediaCodes.push(el.dataset.mediaFileUuid);
  // 	});
  // });

  // const media = document.querySelectorAll('.media-thumbnail-container');

  const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

  // if (confirm(`${media.length}件すべてのメディアデータをダウンロードしますか?`)) {

  // (async () => {
  //   for (let i = 0; i < media.length; i++) {
  //     const mediaCode = media[i].dataset.mediaFileUuid;
  //     location.href = `${topUrl}/media_files/${mediaCode}/download`;
  //     await sleep(3000);
  //   }

  //   location.href = topUrl;
  // })();
  // }
};

export default mitene;
