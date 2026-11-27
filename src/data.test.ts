import { describe, expect, it } from 'vitest'
import { demoEdges, findRoute, getPlace, places, searchPlaces } from './data'

describe('Route safety for the synthetic demo', () => {
  it('rejects missing locations and disconnected endpoints', () => {
    expect(findRoute('C501', 'i109')).toBeNull()
    expect(findRoute('lobby', 'i109', [])).toBeNull()
    expect(findRoute('i109', 'i109')).toEqual([])
  })
  it('produces connected routes with explicit direction instructions for every pair', () => {
    for (const from of places) for (const to of places) {
      const route = findRoute(from.id, to.id)
      expect(route).not.toBeNull()
      let cursor = from.id
      for (const edge of route!) {
        expect(edge.from).toBe(cursor)
        expect(demoEdges).toContain(edge)
        expect(getPlace(edge.to)).toBeDefined()
        cursor = edge.to
      }
      expect(cursor).toBe(to.id)
    }
    expect(findRoute('study', 'i109')![0].turn).toBe('left')
    expect(findRoute('i109', 'study')![0].turn).toBe('right')
  })
  it('terminates when a graph has cycles and no path to the destination', () => {
    expect(findRoute('lobby', 'i119', demoEdges.filter(e => e.from !== 'i119' && e.to !== 'i119'))).toBeNull()
  })
})

describe('Vietnamese search', () => {
  it('matches accents, aliases, room codes and category together', () => {
    expect(searchPlaces('ca phe').map(p => p.id)).toEqual(['coffee'])
    expect(searchPlaces('  PHÒNG I109 ').map(p => p.id)).toEqual(['i109'])
    expect(searchPlaces('cafe', 'study')).toEqual([])
    expect(searchPlaces('C501')).toEqual([])
  })
})
