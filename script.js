// 페이지 로딩이 모두 끝난 후 코드 실행
$(document).ready(function() {
	// 검색 버튼이 눌리거나 검색창에서 엔터 키가 입력될 시 search() 함수 실행
	$('.searchBtn').on('click', search);
	$('.searchInput').on('keyup', function(event) {
		if (event.keyCode === 13) {
			search();
		}
	});

	// 검색 함수
	function search() {
		var searchQuery = $('.searchInput').val();

		// 입력이 빈 칸이면 알림창을 띄움
		if (searchQuery === '') {
			alert('검색어를 입력해주세요.');
			return;
		}

		// iTunes API를 이용하여 검색 결과를 가져옴
		var apiURL = 'https://itunes.apple.com/search?media=music&term=' + encodeURIComponent(searchQuery) + '&lang=ko_kr';

		$.ajax({
			// API 주소에서 json 형태의 데이터를 받아옴
			url: apiURL,
			dataType: 'jsonp',
			// 데이터 로드가 성공할 경우
			success: function(data) {
				// kind가 song인 값만 가져옴 (뮤직 비디오를 제외하기 위함)
				var results = data.results.filter(function(result) {
					return result.kind === 'song';
				});

				//출력값 초기화
				var output = '';
				// 검색 결과 중 상위 10개 출력
				for (var i = 0; i < 10; i++) {
					// 커버, 제목, 가수, 앨범, 발매 연도 값을 가져옴
					var albumCover = results[i].artworkUrl100;
					var trackName = results[i].trackName;
					var artistName = results[i].artistName;
					var albumName = results[i].collectionName;
					var releaseDate = new Date(results[i].releaseDate);

					// 19금 트랙일 경우 제목 뒤에 19 아이콘을 붙임
					if (results[i].trackExplicitness === 'explicit') {
						trackName += ' 🔞';
					}

					// 가수가 5명 이상인 경우 최대 5명까지만 표시
					var artistNames = artistName.split(', ');
					if (artistNames.length > 5) {
						var orgArtistLength = artistNames.length
						artistNames = artistNames.slice(0, 5);
						artistNames.push('외 ' + (orgArtistLength - 5) + '명');
						artistName = artistNames.join(', ');
					}

					// 앨범 제목에서 앨범 유형 제외
					if (albumName.includes('- Single')) {
						albumName = albumName.replace('- Single', '');
					}
					if (albumName.includes('- EP')) {
						albumName = albumName.replace('- EP', '');
					}

					// 출력값 설정
					output += '<hr><div class="res"><div class="img"><img src="' + albumCover + '"></div><div class="text"><p>제목: ' + trackName + '</p><br /><p>가수: ' + artistName + '</p><br /><p>앨범: ' + albumName + ' (' + releaseDate.getFullYear() + ')' + '</p></div></div>';
				}

				// 결과 출력
				$('.result').html(output);
			},
			// 불러오지 못할 경우 알림창을 띄움
			error: function() {
				alert('API 요청 중 오류가 발생했습니다.');
			}
		});
	}
});