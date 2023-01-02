import { ThemeType, THEME_KEY } from '@/constant'
import { setLocalStoreValue } from '@/utils'
import { onScopeDispose, effectScope, ref, isRef, type Ref, watch } from 'vue'

const DEFAULT_OPTIONS: UseThemeOptions = {
  selector: 'html',
}
type UseThemeOptions = {
  selector: string
}

export const useTheme = (
  themeName: ThemeType | Ref<ThemeType> = ThemeType.dark,
  options: UseThemeOptions = DEFAULT_OPTIONS,
) => {
  options = {
    ...DEFAULT_OPTIONS,
    ...options,
  }
  const bodyTag = document.querySelector(options.selector)!
  const usingThemeType = isRef(themeName) ? themeName : ref(themeName)
  const scope = effectScope()

  scope.run(() => {
    const applyTheme = () => {
      let classListStr = String(usingThemeType.value).concat(' ')
      const allThemeType = Array.from<string>(Object.values(ThemeType))
      bodyTag.classList.forEach((item) => {
        if (!allThemeType.includes(item)) {
          classListStr = classListStr.concat(item, ' ')
        }
      })
      bodyTag.classList.value = classListStr
      setLocalStoreValue(THEME_KEY, usingThemeType.value)
    }
    watch(usingThemeType, () => {
      applyTheme()
    })
    applyTheme()
  })
  onScopeDispose(() => {
    scope.stop()
  })

  const changeTheme = (themeType: ThemeType) => {
    usingThemeType.value = themeType
  }

  return changeTheme
}
