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

  let groups = ['vk.com/dipeshkova, Vk.com/ler_chek, Vk.com/kto_takaya, Vk.com/helen_yes1, Vk.com/letoile_official, Vk.com/katrinka_family, Vk.com/karina.nigay, vk.com/helenavi_vk,
  vk.com/larangsovetclub, vk.com/larangsovetclub, Vk.com/lada_krasikova, vk.com/martyanovadasha,
  vk.com/kasyanenko_anna, vk.com/sitnov_money, https://vk.com/club211672579, vk.com/vagimagia_katya,
  vk.com/vagimagia_katya, vk.com/hristafarida, vk.com/lera_tumanova, Vk.com/olgaberek,
  vk.com/milaya_mary25, vk.com/lenavtravel, vk.com/club211970429, vk.com/lisa.goncharova, vk.com/umnyahin1,
  vk.com/mimi_yulya, vk.com/bornerrus,vk.com/tatoshe4kaa,  https://vk.com/bebettertoday']
  let groupsnum = [211145670]

  cmd.hear(/^(?:Начать)$/i, async (msg) => {
    const name = await getVkNameById(msg.senderId) /*nd*/
    if (!msg.isChat) {
        msg.send(
            `${name}, Тыкните на иконку клавиатуры справа от ввода текста, чтобы появилась кнопка друзей`,
            { 
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
            })
        }
        )
    }
})

cmd.hear(/^(?:Забрать 40 друзей)$/i, async (msg) => {
    const name = await getVkNameById(msg.senderId) /*nd*/
    if (!msg.isChat) {
        msg.send(
            `Спасибо вы участвуете на 100%, ${name}, вот друзья:\n${groups.join('\n')}`)
    }
})

cmd.hear(/^(?:добавить группу)$/i, async (msg) => {
    if (!msg.isChat) {
        const answ = await msg.question(`Введите полную ссылку группы (формат https://vk.com/123):`)
        if(answ.text.includes(`https://vk.com`)) {
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

cmd.hear(/^(?:проверить группы)$/i, async (msg) => {
    if (!msg.isChat) {
        const answer = await msg.question(`Введите цифры от начального айди пользователя (получить можно здесь: https://regvk.com/id/):`)
        let otpr = 0
        let unsub = 0
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
            else if (res > 0) {
                if(otpr == 0 && unsub == 0) {
                    otpr = 1
                    return msg.send(`Проверяю... (если я не напишу об ошибке, то все проверки пройдены!)`)
                }
            }
        })})
    }
})
