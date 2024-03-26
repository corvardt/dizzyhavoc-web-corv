import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { batch } from '@preact/signals'
import { Gate } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts'
import { query } from '../chains/query.ts'
import {
    Vortex,
    VortexFlow,
    VortexFlows,
    VortexData,
    TStateOperator
} from '../state2/Vortex.ts'
import { getG1193, wp1193, p1193 as sp1193, P1193 } from '../state2/1193.ts'
import { ejra } from './ejra.ts'

const init:VortexFlow = async function() {
    console.log('flow-init')
    
    // trigger and refresh the abort controller
    this.controller.value.abort()
    const controller = new AbortController()
    this.controller.value = controller

    // invalidate values in tState as specified by this flow
    for (const key of this.invalidate) this.tState[key] = undefined

    // while there are updaters that need to complete, run all updaters
    console.log(this.tState, this.updaters)
    while (this.updaters.value.size) {

        const { signal } = controller
        
        await Promise.all([...this.updaters.value].map(updater => {
            const { tState, updaters, flow } = this
            const key = this.dataKey.get(updater) as string
            const dependencies = this.dependencies.get(updater) as string[]
            const operator = new TStateOperator({ tState, key, signal, updater, updaters })
            const datumUpdaterContext = { operator, dependencies, flow }
            return updater.bind(datumUpdaterContext)()
        }))

        console.log(this.tState, this.updaters)

    }

    const gate = new Gate<void>()
    batch(() => {
        if (!controller.signal.aborted)
        for (const [key, value] of Object.entries(this.tState)) this.uState[key].value = value
        gate.resolve()
    })
    await gate.promise

    while (!controller.signal.aborted) await poll()

}

const chain:VortexFlow = async function() {
    console.log('flow-chain')
    
    // trigger and refresh the abort controller
    this.controller.value.abort()
    const controller = new AbortController()
    this.controller.value = controller

    // invalidate values in tState as specified by this flow
    for (const key of this.invalidate) this.tState[key] = undefined

    // while there are updaters that need to complete, run all updaters
    console.log(this.tState, this.updaters)
    while (this.updaters.value.size) {

        const { signal } = controller
        
        await Promise.all([...this.updaters.value].map(updater => {
            const { tState, updaters, flow } = this
            const key = this.dataKey.get(updater) as string
            const dependencies = this.dependencies.get(updater) as string[]
            const operator = new TStateOperator({ tState, key, signal, updater, updaters })
            const datumUpdaterContext = { operator, dependencies, flow }
            return updater.bind(datumUpdaterContext)()
        }))

        console.log(this.tState, this.updaters)

    }

    const gate = new Gate<void>()
    batch(() => {
        if (!controller.signal.aborted)
        for (const [key, value] of Object.entries(this.tState)) this.uState[key].value = value
        gate.resolve()
    })
    await gate.promise

    while (!controller.signal.aborted) await poll()

}

const account:VortexFlow = async function() {
    console.log('flow-account')
    
    // trigger and refresh the abort controller
    this.controller.value.abort()
    const controller = new AbortController()
    this.controller.value = controller

    // invalidate values in tState as specified by this flow
    for (const key of this.invalidate) this.tState[key] = undefined

    // while there are updaters that need to complete, run all updaters
    console.log(this.tState, this.updaters)
    while (this.updaters.value.size) {

        const { signal } = controller
        
        await Promise.all([...this.updaters.value].map(updater => {
            const { tState, updaters, flow } = this
            const key = this.dataKey.get(updater) as string
            const dependencies = this.dependencies.get(updater) as string[]
            const operator = new TStateOperator({ tState, key, signal, updater, updaters })
            const datumUpdaterContext = { operator, dependencies, flow }
            return updater.bind(datumUpdaterContext)()
        }))

        console.log(this.tState, this.updaters)

    }

    const gate = new Gate<void>()
    batch(() => {
        if (!controller.signal.aborted)
        for (const [key, value] of Object.entries(this.tState)) this.uState[key].value = value
        gate.resolve()
    })
    await gate.promise

    while (!controller.signal.aborted) await poll()

}

const block:VortexFlow = async function() {
    console.log('flow-block')
    
    // trigger and refresh the abort controller
    this.controller.value.abort()
    const controller = new AbortController()
    this.controller.value = controller

    // invalidate values in tState as specified by this flow
    for (const key of this.invalidate) this.tState[key] = undefined

    // while there are updaters that need to complete, run all updaters
    console.log(this.tState, this.updaters)
    while (this.updaters.value.size) {

        const { signal } = controller
        
        await Promise.all([...this.updaters.value].map(updater => {
            const { tState, updaters, flow } = this
            const key = this.dataKey.get(updater) as string
            const dependencies = this.dependencies.get(updater) as string[]
            const operator = new TStateOperator({ tState, key, signal, updater, updaters })
            const datumUpdaterContext = { operator, dependencies, flow }
            return updater.bind(datumUpdaterContext)()
        }))

        console.log(this.tState, this.updaters)

    }

    const gate = new Gate<void>()
    batch(() => {
        if (!controller.signal.aborted)
        for (const [key, value] of Object.entries(this.tState)) this.uState[key].value = value
        gate.resolve()
    })
    await gate.promise

    while (!controller.signal.aborted) await poll()

}

const flows = { init, chain, account, block } as const satisfies VortexFlows

const data = {
    p1193: {
        invalidatedBy: ['init'],
        dependsOn: [],
        async updater() {
            if (this.operator.get()) return
            // const g1193 = getG1193()
            // const p1193 = g1193.ethereum
            // if (!p1193) this.operator.set(new Error('p1193 not found'))
            // else this.operator.set(p1193)
            
            const gate = new Gate<P1193>()
            globalThis.addEventListener('eip6963:announceProvider', event => {
                if (event.detail.info.name == 'MetaMask')
                    gate.resolve(event.detail.provider)
            })
            globalThis.dispatchEvent(new Event('eip6963:requestProvider'))
            this.operator.set(await gate.promise)

        },
        schema: sp1193
    },
    chain: {
        invalidatedBy: ['init', 'chain'],
        dependsOn: ['p1193'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            this.operator.set(await wp1193.chainId())
        },
        schema: z.bigint()
    },
    addresses: {
        invalidatedBy: ['init', 'account'],
        dependsOn: ['p1193'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const addresses = this.flow == 'init'
                ? await wp1193.requestAddresses()
                : await wp1193.addresses()
            this.operator.set(
                addresses instanceof Error
                    ? addresses
                    : addresses.length
                        ? addresses
                        : new Error('no connected addresses'))
        },
        schema: z.string().array()
    },
    rpc: {
        invalidatedBy: ['init', 'chain'],
        dependsOn: ['chain'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const chain = await query({ id: this.operator.get('chain') as bigint})
            this.operator.set(
                chain instanceof Error
                    ? chain
                    : chain.rpc[0]
                        ? chain.rpc[0]
                        : new Error(`no rpc for chain ${chain.chainId}`))
        },
        schema: z.string()
    },
    height: {
        invalidatedBy: ['init', 'chain'],
        dependsOn: ['rpc'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const height = await ejra.height(this.operator.get('rpc') as string)
            this.operator.set(height)
        },
        schema: z.bigint()
    },
    dzhv: {
        invalidatedBy: ['init', 'chain', 'block'],
        dependsOn: ['rpc', 'height'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const rpc = this.operator.get('rpc') as string
            const address = '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe'
            const height = this.operator.get('height') as bigint
            const code = await ejra.code(rpc, address, height)
            this.operator.set(
                code instanceof Error
                    ? code
                    : code == '0x'
                        ? new Error('dzhv not on this chain')
                        : { address })
        },
        schema: z.object({ address: z.literal('0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe') })
    },
    dzhvBalance: {
        invalidatedBy: ['init', 'chain', 'account', 'block'],
        dependsOn: ['rpc', 'addresses', 'dzhv', 'height'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const rpc = this.operator.get('rpc') as string
            const address = (this.operator.get('addresses') as string[])[0] as string
            const dzhv = this.operator.get('dzhv') as { address:string }
            const height = this.operator.get('height') as bigint
            const txCallObject = {
                to: dzhv.address,
                input: `0x70a08231${address.slice(2).padStart(64, '0')}`
            }
            const balance = await ejra.call(rpc, txCallObject, height)
                .then(z.string().transform(BigInt).parseAsync)
                .catch(reason => new Error(reason))
            this.operator.set(balance)
        },
        schema: z.bigint()
    }
} as const satisfies VortexData

const vortex = new Vortex(flows, data)

async function poll() {
    console.log('poll')
    const { controller: { value:controller } } = vortex
    const { rpc, height } = vortex.tState
    if (!rpc || rpc instanceof Error) return
    const newHeight = await ejra.height(rpc)
    if (newHeight instanceof Error) return
    if (height === undefined || height instanceof Error || newHeight <= height) return
    if (controller.signal.aborted) return
    controller.abort() 
    vortex.tState.height = newHeight
    await vortex.flow('block')
}

export { vortex }