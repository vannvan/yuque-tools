/*
 * Description:
 * Created: 2023-10-29 00:35:11
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-10-29 14:24:41
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */
const YUQUE_ICON = {
  close: `<svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" class="larkui-icon larkui-icon-close-outlined"><path d="M34.41 34.499c3.906-3.905 10.238-3.905 14.143 0l79.903 79.902 79.903-79.902c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-79.903 79.903 79.903 79.903c3.834 3.834 3.904 10.008.21 13.927l-.21.215c-3.905 3.906-10.237 3.906-14.142 0l-79.903-79.903-79.903 79.903c-3.905 3.906-10.237 3.906-14.142 0-3.906-3.905-3.906-10.237 0-14.142l79.902-79.903L34.41 48.641c-3.835-3.834-3.904-10.007-.21-13.927Z" fill="currentColor" fill-rule="evenodd"></path></svg>`,
  add: `<svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" class="larkui-icon larkui-icon-add icon-svg ReaderLayout-module_actionItem_CbOzz index-module_size_wVASz" data-name="Add" style="width: 16px; min-width: 16px; height: 16px;"><path d="M128 28c5.523 0 10 4.477 10 10v80h80c5.523 0 10 4.477 10 10s-4.477 10-10 10h-80v80c0 5.523-4.477 10-10 10s-10-4.477-10-10v-80H38c-5.523 0-10-4.477-10-10s4.477-10 10-10h80V38c0-5.523 4.477-10 10-10Z" fill="currentColor" fill-rule="evenodd"></path></svg>`,
  delete: `<svg width="1em" height="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="larkui-icon larkui-icon-action-delete icon-svg index-module_size_wVASz" data-name="ActionDelete" style="width: 16px; min-width: 16px; height: 16px;"><path d="M13.625 4.25a.625.625 0 1 1 0 1.25H12.59l-.385 6.746a2.125 2.125 0 0 1-1.97 1.999l-.152.005H5.917a2.125 2.125 0 0 1-2.122-2.004L3.41 5.5H2.375a.625.625 0 1 1 0-1.25h11.25ZM11.338 5.5H4.661l.382 6.675a.875.875 0 0 0 .768.819l.106.006h4.166a.875.875 0 0 0 .874-.825l.381-6.675ZM6.75 7c.345 0 .625.28.625.625v2.75a.625.625 0 1 1-1.25 0v-2.75c0-.345.28-.625.625-.625Zm2.5 0c.345 0 .625.28.625.625v2.75a.625.625 0 1 1-1.25 0v-2.75c0-.345.28-.625.625-.625Zm1.625-5.25a.625.625 0 1 1 0 1.25h-5.75a.625.625 0 1 1 0-1.25h5.75Z" fill="currentColor" fill-rule="nonzero"></path></svg>`,
  export: `<svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" class="larkui-icon larkui-icon-action-export icon-svg index-module_size_wVASz" data-name="ActionExport" style="width: 16px; min-width: 16px; height: 16px;"><g fill="none" fill-rule="evenodd"><path d="M115 28c16.403 0 29.731 13.164 29.996 29.504L145 58v20.222c0 5.523-4.477 10-10 10-5.43 0-9.848-4.326-9.996-9.72l-.004-.28V58c0-5.43-4.327-9.848-9.72-9.996L115 48H70c-5.43 0-9.848 4.327-9.996 9.72L60 58v140c0 5.43 4.327 9.848 9.72 9.996L70 208h45c5.43 0 9.848-4.327 9.996-9.72L125 198v-20.178c0-5.523 4.477-10 10-10 5.43 0 9.848 4.326 9.996 9.72l.004.28V198c0 16.403-13.164 29.731-29.504 29.996L115 228H70c-16.403 0-29.731-13.164-29.996-29.504L40 198V58c0-16.403 13.164-29.731 29.504-29.996L70 28h45Z" fill="currentColor" fill-rule="nonzero"></path><path d="m97.019 118 116.08.22c5.522.011 9.99 4.497 9.98 10.02-.01 5.429-4.345 9.84-9.739 9.977l-.28.003L96.981 138c-5.523-.01-9.991-4.496-9.981-10.019.01-5.43 4.345-9.84 9.74-9.978l.279-.003Z" fill="currentColor" fill-rule="nonzero"></path><path d="M173.51 77.929c3.834-3.834 10.008-3.904 13.927-.21l.215.21 28.968 28.968c11.599 11.599 11.715 30.332.348 42.073l-.348.353-29.345 29.346c-3.905 3.905-10.237 3.905-14.142 0-3.835-3.834-3.904-10.008-.21-13.927l.21-.215 29.345-29.346c3.834-3.834 3.904-10.007.21-13.926l-.21-.216-28.968-28.968c-3.905-3.905-3.905-10.237 0-14.142Z" fill="currentColor" fill-rule="nonzero"></path><path d="M0 0h256v256H0z"></path></g></svg>`,
}

export { YUQUE_ICON }
