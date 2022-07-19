import { Observable } from '@nativescript/core'

function getMessage(counter) {
  if (counter <= 0) {
    return 'Hoorraaay! You unlocked the NativeScript clicker achievement!'
  } else {
    return `${counter} taps left`
  }
}

export function createViewModel() {
  const viewModel = new Observable()
  viewModel.counter = 42
  viewModel.message = getMessage(viewModel.counter)

  viewModel.onTap = () => {
    viewModel.counter--
    viewModel.set('message', getMessage(viewModel.counter))
  }

  return viewModel
}

