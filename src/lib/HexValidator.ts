import { writable, type Readable } from 'svelte/store'

type ValueType = string | undefined | null
export type ValidatorState = { dirty: boolean, valid: boolean, message: string | null }

export default function createHexValidator() {
    const { subscribe, set } = writable<ValidatorState>({ dirty: false, valid: false, message: null });

    function validate(node: unknown, binding: ValueType) {
        function validate(value: ValueType, dirty: boolean) {
            if (!value) {
                set({ dirty, valid: false, message: 'Required' });
                return
            }

            const valid = /^0x[0-9a-fA-F]+$/.test(value || '');

            set({ dirty, valid, message: valid ? null : 'Invalid hex' });
        }

        validate(binding, false)

        return {
            update(value: ValueType) {
                validate(value, true)
            }
        }
    }

    const validity: Readable<ValidatorState> = { subscribe };

    return { validity, validate }
}