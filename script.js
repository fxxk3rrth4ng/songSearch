$(document).ready(function() {
	$('.searchBtn').on('click', search);
	$('.searchInput').on('keyup', function(event) {
		if (event.keyCode === 13) {
		search();
		}
	});

	function search() {
		var searchQuery = $('.searchInput').val();
		if (searchQuery === '') {
		alert('검색어를 입력해주세요.');
		return;
		}

		var apiURL = 'https://itunes.apple.com/search?media=music&limit=10&term=' + encodeURIComponent(searchQuery) + '&lang=ko_kr';

		$.ajax({
		url: apiURL,
		dataType: 'jsonp',
		success: function(data) {
			var results = data.results.filter(function(result) {
				return result.kind === 'song';
			});

			var output = '';
			for (var i = 0; i < results.length; i++) {
				var albumCover = results[i].artworkUrl100;
				var trackName = results[i].trackName;
				var artistName = results[i].artistName;
				var albumName = results[i].collectionName;
				var releaseDate = new Date(results[i].releaseDate);

				if (results[i].trackExplicitness === 'explicit') {
					var trackExplicitness = ' 🔞';
				} else {
					var trackExplicitness = '';
				}

			// 가수가 5명 이상인 경우 최대 5명까지만 표시
				var artistNames = artistName.split(', ');
				if (artistNames.length > 5) {
					var orgArtistLength = artistNames.length
					artistNames = artistNames.slice(0, 5);
					artistNames.push('외 ' + (orgArtistLength - 5) + '명');
					artistName = artistNames.join(', ');
				}

				output += '<hr><div class="res"><div class="img"><img src="' + albumCover + '"></div><div class="text"><p>제목: ' + trackName + trackExplicitness + '</p><br /><p>가수: ' + artistName + '</p><br /><p>앨범: ' + albumName + ' (' + releaseDate.getFullYear() + ')' + '</p></div></div>';
			}

			$('.result').html(output);
		},
		error: function() {
			alert('API 요청 중 오류가 발생했습니다.');
		}
		});
	}
	});