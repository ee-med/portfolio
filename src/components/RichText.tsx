import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import React from 'react'

export function RichText({
  data,
  className = '',
}: {
  data?: SerializedEditorState | null
  className?: string
}) {
  if (!data) return null
  return (
    <div
      className={`max-w-none leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-fg [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 ${className}`}
    >
      <LexicalRichText data={data} />
    </div>
  )
}
