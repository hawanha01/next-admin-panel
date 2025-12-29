'use client'

import { useState, useEffect, startTransition } from 'react'
import dynamic from 'next/dynamic'

// Import Quill styles - must be imported before the component
import 'react-quill-new/dist/quill.snow.css'

// Dynamically import react-quill-new (React 19 compatible) to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new')
    return { default: RQ }
  },
  {
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded" />,
  }
)

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function QuillEditor({
  value,
  onChange,
  placeholder = 'Enter email content...',
  className = '',
}: QuillEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    startTransition(() => {
      setMounted(true)
    })
  }, [])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
    'image',
    'color',
    'background',
  ]

  if (!mounted) {
    return <div className={`${className} h-96 bg-gray-100 animate-pulse rounded`} />
  }

  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'white',
          minHeight: '400px',
        }}
      />
    </div>
  )
}
