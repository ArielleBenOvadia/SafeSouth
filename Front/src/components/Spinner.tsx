

export default function Spinner({
    spinnerSize = "md"
}: {spinnerSize: 'sm' | 'md' | 'lg'}) {

    return <div className={`spinner spinner-${spinnerSize}`}/>
}