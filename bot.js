const { HearManager } = require('@vk-io/hear');
const { QuestionManager } = require('vk-io-question');
const {VK, resolveResource, API, getRandomId, Keyboard, MessageForwardsCollection} = require('vk-io');
const { post } = require('request');

const vk = new VK({
    // token: '64d54def091abf4c3b1d24341e258f5b701ca40156edc232a9264b0639affa706f97bbb33459c4dfb872c'
    token: '299d7b54ff604e9963bf8519923be135323f30c0e4990f4c90367beb4c716a1c6fce49bad5097e8cab43a'
});

const { api, updates, snippets } = vk

const questionManager = new QuestionManager();
const cmd = new HearManager();
const commands = [];

vk.updates.use(questionManager.middleware);
vk.updates.on('message_new' , cmd.middleware)

cmd.hear(/^hello$/, async (context) => {
await context.send('Hello!');
});

console.log('Поехали!')
vk.updates.start()

async function getVkNameById(id) {
    const [data] = await api.users.get({
      user_ids: id,
    });
    return data.first_name;
  } 

   let groups = ['http://vk.com/dipeshkova', 'http://vk.com/letoile_official', 'http://vk.com/karina.nigay', 'http://vk.com/larangsovetclub', 'http://vk.com/martyanovadasha', 'http://vk.com/kasyanenko_anna', 'http://vk.com/sitnov_money', 'https://vk.com/club211672579', 'http://vk.com/hristafarida', 'http://vk.com/lera_tumanova', 'http://vk.com/club211970429', 'http://vk.com/umnyahin1', 'http://vk.com/bornerrus', 'https://vk.com/bebettertoday', 'https://vk.com/goldapple_ru', 'https://vk.com/official_helenyes', 'https://vk.com/sozoniknastya', 'https://vk.com/dr.amjad_alyousef',
'https://vk.com/danceology', 'https://vk.com/ssfatofficial', 'https://vk.com/mama_na_shpilke',
'https://vk.com/businessrez']

let groupsnum = [211145670, 211338974, 211111535, 166286356, 211268126, 211702084, 211672579, 44515433, 180689388, 81820511, 211970429, 211473033, 182678624, 212042791, 179634451, 182678624, 211211151, 149675112, 211286717, 211219777, 212517876]

  let others = ['http://vk.com/ler_chek', 'http://vk.com/kto_takaya', 'http://vk.com/helen_yes1', 'http://vk.com/katrinka_family', 'http://vk.com/helenavi_vk', 'http://vk.com/lada_krasikova', 'http://vk.com/vagimagia_katya', 'http://vk.com/olgaberek', 'http://vk.com/milaya_mary25', 'http://vk.com/lenavtravel', 'http://vk.com/lisa.goncharova', 'http://vk.com/mimi_yulya', 'http://vk.com/tatoshe4kaa', 'https://vk.com/kdavydova_official', 'https://vk.com/guseinn', 'https://vk.com/vladkrasavin', 'https://vk.com/akilovaaa'

  setInterval(() => {
    vk.api.messages.send({
        user_id: 646054353,
        random_id: Date.now(),
        message: `Текущее время: ${Date.now()}`
    })
  }, 1800000);

  cmd.hear(/^(?:Начать)$/i, async (msg) => {
    const name = await getVkNameById(msg.senderId) /*nd*/
    if (!msg.isChat) {
            vk.api.messages.send({
                user_id: msg.senderId,
                random_id: Date.now(),
                message: `${name}, Тыкните на иконку клавиатуры справа от ввода текста, чтобы появилась кнопка друзей`,
                attachment: 'photo-211145670_457239074',
                keyboard: JSON.stringify(
            {
                "one_time": false,
                "buttons": [ 
                [{ 
                "action": { 
                "type": "text", 
                "payload": "{\"button\": \"1\"}", 
                "label": "Забрать 40 друзей" 
                }, 
                "color": "positive" 
                }],
            ]
            }
        )
    })
    }
})

cmd.hear(/^(?:Забрать 40 друзей)$/i, async (msg) => {
    const name = await getVkNameById(msg.senderId) /*nd*/
    if (!msg.isChat) {
        msg.send(
            `Спасибо вы участвуете на 100%, ${name}, вот друзья:\n\nСообщества:\n\n${groups.join('\n')}\n\nПользователи:\n\n${others.join('\n')}`)
    }
})

cmd.hear(/^(?:добавить группу)$/i, async (msg) => {
    if (!msg.isChat) {
        const answ = await msg.question(`Введите полную ссылку группы (формат https://vk.com/123):`)
        if(answ.text.includes(`vk.com`)) {
             msg.send(`Отлично! Полная ссылка добавлена в массив.`)
             groups.push(answ.text)
             const answer = await msg.question(`Введите цифры от начального айди группы (получить можно здесь: https://regvk.com/id/):`)
                if (/[a-zA-Z]/.test(answer.text)){
                    msg.send(`Формат неверный! Выполните данную команду снова.`)
                }
                else {
                    groupsnum.push(Number(answer.text))
                return msg.send(`Всё получилось! Цифровое айди добавлено в список.`)
        }
        }
        else if(!answ.text.includes(`https://vk.com`)) {
            return msg.send(`Формат ссылки неверный. Повторите данную команду снова!`)
        }
    }
})

cmd.hear(/^(?:удалить группу)$/i, async (msg) => {
    const name = await getVkNameById(msg.senderId) /*nd*/
    if (!msg.isChat) {
       const answer = await msg.question('Введите ссылку на группу, которую хотите удалить (прим. https://vk.com/123')
       if(!answer.text.includes('https://vk.com')) {msg.send('Формат ссылки неверный')}
       if(!groups.includes(answer.text)) {msg.send('Такой группы нет в списке!')}
       else {
     let item = groups.indexOf(answer.text);
     groups.splice(item, 1)
     const answ = await msg.question('Удалил ссылку из списка. Теперь нужно удалить ее начальный айди. Чтобы узнать его воспользуйтесь сайтом https://regvk.com/id/ (туда вставьте ссылку на группу, которую вы только что удалили и скопируйте айди из цифр, пример: 123)')
     if (/[a-zA-Z]/.test(answ.text)){
                    msg.send(`Формат неверный! Выполните данную команду снова.`)
     }
     if(!groupsnum.includes(Number(answ.text))) {msg.send('Такой группы нет в списке!')}
     else {
    let num = groupsnum.indexOf(answ.text)
    groups.splice(num, 1)
    msg.send('Успешно!')
}
}

}

})

cmd.hear(/^(?:добавить пользователя)$/i, async (msg) => {
    if (!msg.isChat) {
        const answ = await msg.question(`Введите полную ссылку на пользователя (формат https://vk.com/123):`)
        if(answ.text.includes(`vk.com`))
             msg.send(`Отлично! Полная ссылка добавлена в массив.`)
             others.push(answ.text)
    }
})

cmd.hear(/^(?:удалить пользователя)$/i, async (msg) => {
    const name = await getVkNameById(msg.senderId) /*nd*/
    if (!msg.isChat) {
       const answer = await msg.question('Введите ссылку на пользователя, которую хотите удалить (прим. https://vk.com/123')
       if(!answer.text.includes('vk.com')) {msg.send('Формат ссылки неверный')}
       if(!others.includes(answer.text)) {msg.send('Такого пользователя нет в списке!')}
       else {
     let item = others.indexOf(answer.text);
     others.splice(item, 1)
     return msg.send('Успешно')
}
}

})

cmd.hear(/^(?:проверить группы)$/i, async (msg) => {
    if (!msg.isChat) {
        const answer = await msg.question(`Введите цифры от начального айди пользователя (получить можно здесь: https://regvk.com/id/):`)
        let otpr = 0
        let unsub = 0
        msg.send('Проверяю... (займёт до 2 минут, если не будет сообщений об ошибке, то проверка пройдена!)')
        groupsnum.forEach((item, index, array) => {
            vk.api.groups.isMember({
            user_id: answer.text,
            group_id: item,
        }).then(function(res) {
            console.log(res)
            if(res < 1) {
                unsub = 1
               return msg.send(`Ошибка! Пользователь не подписался на группу: vk.com/club${item}.`)
            }
        })})
    }
})
