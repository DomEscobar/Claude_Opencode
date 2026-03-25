import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '../UserCard.vue'

describe('UserCard', () => {
  it('renders name and email', () => {
    const wrapper = mount(UserCard, {
      props: {
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
    })

    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.text()).toContain('jane@example.com')
  })
})
