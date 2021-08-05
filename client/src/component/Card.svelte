<script>
  import CardIcon from './CardIcon.svelte';
  import Role from '../component/Role.svelte';

  import Fa from 'svelte-fa';
  import { faHeart, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
  import { PlusIcon, MinusIcon, AwardIcon, XIcon } from 'svelte-feather-icons'
  import { State } from '../../../types/dist/State';
  import { CardType } from '../../../types/dist/Card';

  export let room;
  export let self;
  export let bid;
  export let pick;
  export let state;

  let sleep = {title : 'Sleep', description : 'Do nothing', cost : 0};

  let visibleCard = false;
  let visiblePlayer = false;

  let selectingTurn = 0;
  let selectingCard = 0;

  const closeCard = () => {
    visibleCard = false;
    selectingTurn = 0;
  }

  const showCard = (index) => {
    visibleCard = true;
    selectingTurn = index;
    console.log(self);
  }

  const closePlayer = () => {
    visiblePlayer = false;
  }

  const showPlayer = (index) => {
    console.log('hi');
    selectingCard = index - 1;
    visiblePlayer = true;
    console.log(self);
  }

  const findPlayer = (position) => {
    for (let player of room.players) {
      if (player.position == position) return player;
    }
  }


  const select = (index) => {
    index = index - 1;
    for (let i = 0; i < 3; i++) {
      if (self.play[i].index == index) {
        self.play[i].index = -1;
        self.play[i].target = -1;
      }
    }
    self.play[selectingTurn].index = index;
    self.play[selectingTurn].target = -1;
    closeCard();
    pick();
  }

  const selectTarget = (target) => {
    let index = selectingCard;
    for (let i = 0; i < 3; i++) {
      if (self.play[i].index == index) {
        self.play[i].index = -1;
        self.play[i].target = -1;
      }
    }
    self.play[selectingTurn].index = index;
    self.play[selectingTurn].target = target;
    closeCard();
    closePlayer();
    pick();
  }


  $: isSelected = (index) => {
    if (index < 0) return false;
    for (let i = 0; i < 3; i++) {
      if (self.play[i].index == index) return true;
    }
    return false;
  }

  $: getDeck = () => {
    let deck = [];
    if (state === State.shop || state === State.shopResult) {
      deck = room.shop;
    } else if (state === State.pick) {
      for (let play of self.play) {
        if (play.index < 0) {
          deck.push(sleep)
        } else {
          let card = self.hand[play.index];
          card.target = play.target;
          deck.push(card);
        }
      }
    } else if (state === State.turn1 || state === State.turn2 || state === State.turn3) {
      deck = room.log[room.log.length - 1];
    }
    return deck;
  }

  $: getPlayers = () => {
    let players = [];
    for (let player of players) {
      if (player.isDeath) continue;
      players.push(player);
    }
    return players;
  }

  $: deck = getDeck();
  $: players = getPlayers();

  console.log(room);
  
</script>

{#if state == State.shop}
  {#each deck || [] as card, index}
    <div class='card1'>
      <div class='cost'>{card.cost}</div>
      <div class='icon'><CardIcon title={card.title}/></div>
      <div class='title'>{card.title}</div>
      <div class='description'>{card.description}</div>
      <div class='footer-shop'>
        <button class='minus' on:click={() => {self.bids[index]--;self.bids[index] = Math.max(0,self.bids[index]);bid();}}><MinusIcon size='18'/></button>
        <span class='middle'>{self.bids[index]}</span>
        <button class='plus' on:click={() => {self.bids[index]++;bid();}}><PlusIcon size='18'/></button>
      </div>
    </div>
  {/each}
{:else if state == State.shopResult}
  {#each deck || [] as card, index}
    <div class='card1'>
      <div class='cost'>{card.cost}</div>
      <div class='icon'><CardIcon title={card.title}/></div>
      <div class='title'>{card.title}</div>
      <div class='description'>{card.description}</div>
      <div class='footer-result'>
        {#if room.shopResult[index] !== ''}
          <div class='win'><AwardIcon size='18'/>{room.shopResult[index]}</div>
        {:else}
          <div class='lose'>nobody wins</div>
        {/if}
      </div>
    </div>
  {/each}
{:else if state == State.pick}
  {#each deck || [] as card, index}
    <div class='container'>
      <div class='header'>Turn {index+1}</div>
      <div class='card1 pick' on:click={() => showCard(index)}>
        <div class='cost'>{card.cost}</div>
        <div class='icon'><CardIcon title={card.title}/></div>
        <div class='title'>{card.title}</div>
        <div class='description'>{card.description}</div>
        {#if card.target >= 0}
        <div class='footer-target'>
          <Fa icon={faCrosshairs}/> {findPlayer(card.target).name}
        </div>
        {/if}
      </div>
    </div>
  {/each}
{:else if state == State.turn1 || state == State.turn2 || state == State.turn3}
  {#each deck || [] as card, index}
    <div class='container'>
      <div class='header'>{card.owner.name}</div>
      <div class='card1 pick' on:click={() => showCard(index)}>
        <div class='cost'>{card.cost}</div>
        <div class='icon'><CardIcon title={card.title}/></div>
        <div class='title'>{card.title}</div>
        <div class='description'>{card.description}</div>
        {#if card.cardType == CardType.single}
          <div class='footer-target'>
            <Fa icon={faCrosshairs}/> {card.target[0].name}
          </div>
        {/if}
      </div>
    </div>
  {/each}
{:else}
  {#each self.hand || [] as card, index}
    <div class='card1'>
      <div class='cost'>{card.cost}</div>
      <div class='icon'><CardIcon title={card.title}/></div>
      <div class='title'>{card.title}</div>
      <div class='description'>{card.description}</div>
    </div>
  {/each}
{/if}

{#if state == State.pick} 
  <div class='modal' id='joinRoom' style='display:{visibleCard === true ? "block" : "none"}'> 
    <div class='container'> 
      <div class='close' on:click={closeCard}><XIcon size='24'/></div>  
      <div class='content'> 
        <div class='title'> 
          Pick a card 
        </div>  
        <div class='deck'>  
          {#each [sleep].concat(self.hand) || [] as card, index}  
            <div class='card1 {isSelected(index - 1) ? 'selected' : ''}'  
            on:click={() => card.cardType === CardType.single ? showPlayer(index) : select(index)}> 
              <div class='cost'>{card.cost}</div> 
              <div class='icon'><CardIcon title={card.title}/></div>  
              <div class='title'>{card.title}</div> 
              <div class='description'>{card.description}</div> 
            </div>  
          {/each} 
        </div>  
      </div>  
    </div>  
  </div>

  <div class='modal' id='joinRoom' style='display:{visiblePlayer === true ? "block" : "none"}'> 
    <div class='container'> 
      <div class='close' on:click={closePlayer}><XIcon size='24'/></div>  
      <div class='content'> 
        <div class='title'> 
          Pick a target
        </div>  
        <div class='players'>  
          {#each players || [] as player}
            <div class='player {self.play[selectingTurn].target == player.position ? 'selected' : ''}'
            on:click={selectTarget(player.position)}>
              <div class='role'>
                <Role self={player}/>
              </div>
              <div class='data'>
                <div class='name'>
                  {player.name}
                </div>
                <div class='stats'>
                  <div class='heart'><Fa icon={faHeart}/></div> {player.health}
                </div>
              </div>
            </div>
          {/each}
        </div>  
      </div>  
    </div>  
  </div>
{/if}


<style lang='scss'>
  .pick {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
  .pick:hover {
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  }

  .container {
    .header {
      text-align: center;
      font-size: 24px;
      padding-bottom: .5em;
    }
  }

  .modal {
    .players {
      display: grid;
      grid-template-columns: auto auto auto auto;
      gap: 3em;
      align-items: center;
      justify-content: center;
      max-height: 400px;
      .ready {
        border-color:#16C79A;
      }
      .player {
        font-weight: 500;
        padding: .5em 1em;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        border-radius: 12px;
        display: grid;
        align-items: center;
        justify-content: center;
        grid-auto-flow: column;
        column-gap: 18px;
        color: #424874;
        .role {
          font-size: 46px;
        }
        .data {
          .name {
            font-size: 18px;
          }
          .stats {
            display: flex;
            align-items: center;
            font-size: 18px;
            .heart {
              width : 1em;
              margin-right: .4em;
            }
          }
        }
      }
      .player {
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      }
      .player:hover {
        box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
      }
      .selected {
        box-shadow: rgba(22, 199, 154, 0.5) 0px 0px 0px 3px !important;
      }
    }
    .deck {
      display: grid;
      grid-template-columns: auto auto auto auto;
      row-gap: 3em;
      column-gap: 3em;
      padding: 1em;
    }
    
    .card1 {
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    }
    .card1:hover {
      box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
    }
    .selected {
      box-shadow: rgba(22, 199, 154, 0.5) 0px 0px 0px 3px !important;
    }
  }

  .card1 {
    background-color: white;
    display: grid;
    justify-content: center;
    align-items: center;
    row-gap: 0px;
    padding: 0;
    margin: 0;
    border-radius: 12px;
    width: 200px;
    min-height: 275px;
    .icon {
      margin: auto;
    }
    .title {
      font-size: 32px;
      margin: 0;
      text-align: center;
    }
    .cost {
      padding: 0.5em 0 0 0.5em;
      font-size: 32px;
    }
    .description{
      text-align: center;
      padding: .8em;
      width: 160px;
    }
    .footer-target {
      text-align: center;
      height: 40px;
      fill: #DA0037;
      color: #DA0037;
    }
    .footer-result {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      .win {
        display: flex;
        align-items: center;
        text-align: center;
        fill: #16C79A;
        color: #16C79A;
      }
      .lose {
        fill: #DA0037;
        color: #DA0037;
      }
    }
    .footer-shop {
      display: grid;
      grid-template-columns: 60px auto 60px;
      align-items: center;
      text-align: center;
      
      .minus {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        height: 40px;
        border-radius: 0 0 0 12px;
        background-color: inherit;
      }
      .minus:hover{
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      }
      .middle {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .plus {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        border-radius: 0 0 12px 0;
        background-color: inherit;
      }
      .plus:hover{
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      }
    }
  }
</style>
