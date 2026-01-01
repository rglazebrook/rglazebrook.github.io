import { render } from 'preact';
import { signal } from '@preact/signals';
import { html } from 'htm/preact';

/**
 * @typedef {object} Miner
 * @property {number} accepted
 * @property {string} algorithm
 * @property {number} diff
 * @property {number} hashrate
 * @property {string} identifier
 * @property {*} it 
 * @property {number} ki 
 * @property {number} pg
 * @property {string} pool
 * @property {number} rejected
 * @property {number} sharerate
 * @property {number} sharetime
 * @property {string} software
 * @property {string} threadid
 * @property {string} username
 * @property {string} wd
 * 
 * @typedef {object} Thread
 * @property {number} hashrate
 * @property {number} shares
 * @property {number} diff
 * 
 * @typedef {object} Board
 * @property {string} name
 * @property {number} hashrate
 * @property {number} shares
 * @property {Thread[]} threads
 *
 * @typedef {object} Rig
 * @property {number} id
 * @property {number} hashrate
 * @property {number} threads
 * @property {number} shares
 * @property {Board[]} boards
 */

/** @type {{ value: Rig[] }} */
const rigs = signal([]);
const user = signal("RobbyG")
const success = signal(true);

// const query = location.search.slice(1).split("&").map(i => i.split("="));
// console.log(query);

const API_URL = 'https://server.duinocoin.com/miners/';
// const user = query.find(q => q[0] === "user")[1] || "RobbyG";
const num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

const handleUserChange = (e) => {
  user.value = e.currentTarget.value;
  updateData();
}

// Load our data
/** @returns {Miner[]} */
async function loadData() {
  const res = await fetch(`${API_URL}${user}`);
  /** @type {{ result: Miner[]}} */
  const json = await res.json();
  success.value = json.success;
  return json.result;
}

// Update our data. Run immediately and then every 10 seconds
async function updateData() {
  try {
    const miners = await loadData();
    parseData(miners);
  }
  catch (err) {
    console.error(err);
  }
}
updateData(); // initial update
setInterval(updateData, 10000); // update every 10 seconds

/** 
 * Loops through the JSON data and creates and array of Rigs.
 * @param {Miner[]} miners  
 */
function parseData(miners) {
  /** @type {Rig[]} */
  const newData = [];
  if (success.value) {
    miners.forEach(miner => {
      const rigId = miner.wd || 'Unknown Rig';
      const name = miner.identifier || 'Unknown Board';
      const rigName = name.replace(/-?\d+$/, "");
      const hashrate = Number(miner.hashrate) || 0;
      const shares = miner.accepted;
      const diff = Number(miner.diff) || 0;

      if (!newData.find(rig => rig.id === rigId)) {
        newData.push({ id: rigId, name: rigName, threads: 0, hashrate: 0, shares: 0, boards: []})
      }
      const myRig = newData.find(rig => rig.id === rigId);
      myRig.threads++;
      myRig.hashrate += hashrate;
      myRig.shares += shares;
      if (!myRig.boards.find(board => board.name === name )) {
        myRig.boards.push({
          name,
          hashrate,
          shares,
          threads: [{ hashrate, shares, diff }]
        })
      }
      else {
        myRig.boards.find(board => board.name === name).hashrate += hashrate;
        myRig.boards.find(board => board.name === name).shares += shares;
        myRig.boards.find(board => board.name === name).threads.push(
          { hashrate, shares, diff}
        )
      }
    });
    rigs.value = newData;
  }
}

/**
 * Formats hash to KH or MH as needed
 * @param {number} hash 
 * @returns {string}
 */
function formatHashrate(hash) {
  if (hash < 1e3) {
    return `${num.format(hash)} H/s`;
  }
  if (hash < 1e6) {
    return `${num.format((hash / 1e3))} KH/s`;
  }
  return `${num.format((hash / 1e6))} MH/s`;
}

/** 
 * Single Rig component
 * @param {object} props
 * @param {Rig} props.data
 */
function Rig({data}) {
  return html`
    <details class="rig" open>
      <summary class="rig--summary">
        ${data.name ?? data.id}
        ${(data.threads) > 1 ? ` (${data.threads})` : ""}<span>•</span>
        <span>${num.format(data.shares)} shares</span><span>•</span>
        <span>${formatHashrate(Number(data.hashrate))}</span>
      </summary>
      <div class="boards">
        ${data.boards.sort((a, b) => a.name.replace("-","0") > b.name.replace("-", "0") ? 1 : -1).map(board => html`<${Board} key=${board.name} data=${board} />`)}
      </div>
    </details>
  `;
}

/**
 * Single Board component
 * @param {object} props
 * @param {Board} props.data 
 */
function Board({data}) {
  return html`
    <details class="board" open>
      <summary class="board--summary">
      ${data.name}
      <span>•</span>
      <span>${num.format(data.shares)} shares</span><span>•</span>
      <span>${formatHashrate(Number(data.hashrate))}</span>
    </summary>
    <div class="board--threads">
      ${data.threads.map((thread, i) => html`
        <div class="thread">
          <h4>Thread ${i + 1}</h4>
          <ul>
            <li>${formatHashrate(thread.hashrate)}</li>
            <li>${num.format(thread.shares)} shares</li>
            <li>${num.format(thread.diff)} diff</li>
          </ul>
        </div>
      `)}
    </div>
    </details>
  `;
}

// Main wrapper component
function App() {
  return html`
    <h1>
      <span>Hello ${user.value}!</span>
      <input class="user" value=${user.value} onChange=${handleUserChange} />
    </h1>
    <div class="rigs">
      ${success.value ? 
        rigs.value.map(rig => (html`<${Rig} key=${rig.id} data=${rig} />`)) :
        html`
          <div class="error">Could not find any results for ${user.value}.</div>
        `
      }
    </div>
  `;
}

render(html`<${App} />`, document.body);