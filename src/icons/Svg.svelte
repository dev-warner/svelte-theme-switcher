<script>
  export let size = 30;
  export let title = "";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 36 36"
  width={size}
  height={size}>
  <title>{title}</title>
  <slot />
</svg>
