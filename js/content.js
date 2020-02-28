$(function () {
    setTimeout(() => {
        console.log('Starting');
        if ($('.edo3-DialogController').length) {
            $('.edo3-Dialog__head-firstLine').prepend('<span id="15min" class="ws-link">15 min</span>');
            var initialized = false;

            $('#15min').click(() => {

                if (!initialized) {
                    var script = document.createElement('script');
                    script.setAttribute('data-vdom-ignore', 'true');
                    let scriptText = addTime.toString().replace('addTime', 'addTimeScript') + 'addTimeScript()';
                    script.innerHTML = scriptText;
                    document.head.appendChild(script);
                    // initialized = true;
                }

                // addTimeScript();
            });
        }
    }, 4000)
});

function addTime() {
    // Hernya
    requirejs(['Types/source', 'EngineUser/Info'], function(sourceLib, userInfo){

        const documentId = document.getElementsByClassName('edo3-Dialog')[0].controlNodes[0].control._options.record.get('@Документ');

        new sourceLib.SbisService({
            endpoint: {
                contract: 'EventAggregator',
                address: '/service/?x_version=20.1104-84'
            }
        }).call(
        'CreateEvent',
        {
            "event_source": "Работа",
            "method_name": "Работа.СоздатьСполями",
            "filter": {
                "d": [
                    userInfo.Info.get('ЧастноеЛицо'),
                    documentId,
                    "Я"
                ],
                "s": [
                    {
                        "t": "Число целое",
                        "n": "Автор"
                    },
                    {
                        "t": "Строка",
                        "n": "Документ"
                    },
                    {
                        "t": "Строка",
                        "n": "Метка"
                    }
                ],
                "_type": "record"
            }
        }
        ).addBoth((data) => {
            // data.getRow().set('ДатаОкончания', '2020-02-27 18:09:00');
            // data.getRow().set('ДатаНачала', '2020-02-27 18:08:00');

            console.log('Created event');

            let date = new Date();
            let coeff = 1000 * 60;
            let interval = 1000 * 60 * 15;
            let endDate = new Date(Math.round(date.getTime() / coeff) * coeff);
            let startDate = new Date(endDate.getTime() - interval);

            data.getRow().set({
                'ДатаНачала': startDate,
                'ДатаОкончания': endDate,
                'Примечание': 'Test2',
                'ЧастноеЛицо': userInfo.Info.get('ЧастноеЛицо')
            });
            
            new sourceLib.SbisService({
                endpoint: {
                    contract: 'EventAggregator',
                    address: '/service/?x_version=20.1104-84'
                }
            }).call(
            'UpdateEvent',
            {
                "event_source": "Работа",
                "data": data
            }
            ).addBoth(() => {console.log('Updated event');});
        });
    });
}