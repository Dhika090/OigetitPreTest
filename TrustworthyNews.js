    async function getTrustworthyNewsData() {
        try {
            const response = await fetch('https://ai.oigetit.com/AI71/Histogram?json=%7B%22StartDate%22:%222024-09-01%22,%22EndDate%22:%222024-10-01%22,%22Query%22:%22UAE%22%7D');
            const data = await response.json();
            console.log('Trustworthy News Data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function groupDataForTrustScore(data) {
        const grouped = {};

        data.forEach(entry => {
            const day = new Date(entry.pubdate).toLocaleDateString('en-GB', {
                weekday: 'long'
            });

            if (!grouped[day]) {
                grouped[day] = {
                    totalScore: 0,
                    count: 0
                };
            }

            grouped[day].totalScore += entry.trusted;
            grouped[day].count += 1;
        });

        return Object.entries(grouped).map(([day, {
            totalScore,
            count
        }]) => ({
            day,
            averageScore: Math.round((totalScore / count) * 100)
        }));
    }

    async function renderTrustworthyNewsChart() {
        const newsData = await getTrustworthyNewsData();

        if (newsData && newsData.length > 0) {
            const trustScoreData = groupDataForTrustScore(newsData);

            Highcharts.chart('trustworthy-news-chart', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Trustworthy News Score'
                },
                xAxis: {
                    categories: trustScoreData.map(item => item.day),
                    title: {
                        text: 'Days'
                    }
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    tickInterval: 10,
                    title: {
                        text: 'Percentage %'
                    }
                },
                tooltip: {
                    formatter: function () {
                        const score = trustScoreData[this.point.index];
                        return `<b>${score.day}</b><br><b>Average Trust Score:</b> ${score.averageScore}%`;
                    }
                },
                series: [{
                    name: 'Trust Score',
                    data: trustScoreData.map(item => item.averageScore),
                    color: '#1abc9c'
                }],
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true,
                            format: '{y}%'
                        }
                    }
                }
            });
        } else {
            console.error('No valid data found.');
        }
    }

    document.addEventListener('DOMContentLoaded', renderTrustworthyNewsChart);