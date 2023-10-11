import { useEffect } from 'react'

export default (
    callback: (config: { lock: boolean }) => void,
    deps = [],
    returnEffect: () => void = () => null,
) => {
    useEffect(() => {
        const config = { lock: false }

        callback(config)

        return () => {
            config.lock = true

            returnEffect && returnEffect()
        }
    }, deps)
}
