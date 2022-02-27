import axios from 'axios';

const mitene = async() => {
  const topUrl = location.href;

  const promises = [];
  const mediaCodes = [];

  let pageJudge = true;
  let page = 1;

    while (pageJudge) {
      await console.log(page);
      await axios({
        method: 'GET',
        url: topUrl + `?page=${page}`,
        responseType: 'document',
      }).then((res) => {
        if (!res.data.querySelectorAll('.media-thumbnail-container').length) {
          pageJudge = false;
        } else {
        }
      });
      await page++;
    }

	await page--;
	await console.log('最大ページ'+page);

  // 最大ページ数に関しては今のところ手動（要検討）
  for (let i = 1; i <= page; i++) {
    promises.push(
      axios({
        method: 'GET',
        url: topUrl + `?page=${i}`,
        responseType: 'document',
      })
    );
  }

  Promise.all(promises).then((res) => {
    res.forEach((obj) => {
      obj.data.querySelectorAll('.media-thumbnail-container').forEach((el) => {
        mediaCodes.push(el.dataset.mediaFileUuid);
      });
    });

    const params = new URLSearchParams();
    params.append('code', JSON.stringify(mediaCodes));

    axios.post('http://localhost/bookmarklet/php/db.php', params).then((res) => {
      console.log(res.data);

      const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

      if (Object.keys(res.data).length) {
        if (confirm(`${Object.keys(res.data).length}件すべてのメディアデータをダウンロードしますか?`)) {
          (async () => {
            if (res.data) {
              let mediaLength = Object.keys(res.data).length;
              for (let index in res.data) {
                const mediaCode = res.data[index];
                // console.log(mediaCode)

                location.href = `${topUrl}/media_files/${mediaCode}/download`;
                await sleep(3000);
                mediaLength--;
                console.log(`残り${mediaLength}件`);
              }

              params.append('exec', 'insert');
              await axios.post('http://localhost/bookmarklet/php/db.php', params);

              location.href = topUrl;
            }
          })();
        }
      } else {
        alert('前回のダウンロード状況は最新です。');
      }
    });
  });
};

export default mitene;
