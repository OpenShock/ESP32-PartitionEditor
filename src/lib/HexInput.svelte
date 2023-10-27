<script lang="ts">
  import createHexValidator from "./HexValidator";

  export let value: string = '';
  export let placeholder: string = '0x0';
  export let isValid: boolean = false;

  const { validity, validate } = createHexValidator();

  $: isValid = $validity.valid;
</script>

<input class="input" type="text" {placeholder} bind:value={value} use:validate={value} />