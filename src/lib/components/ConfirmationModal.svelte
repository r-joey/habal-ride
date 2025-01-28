<script>
    const { title, body, btnText, btnClass, next } = $props(); 
    let modalRef 
</script>
<button class={btnClass} onclick={() => modalRef.showModal()}>{btnText}</button> 
<dialog bind:this={modalRef} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">{title}</h3>
    <p class="py-4">{body}</p>
    <div class="modal-action">
      <form method="dialog"> 
        <button type="submit" class="btn">Cancel</button>
        <button onclick={() => next()} type="button" class="btn btn-primary w-24">OK</button>
      </form>
    </div>
  </div>
</dialog>